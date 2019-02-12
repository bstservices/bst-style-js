/* Copyright 2017 BST Event Services, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import * as Lint from "tslint";
import * as ts from "typescript";


const OPTION = {
  "type": "string",
  "enum": [
    "always",
    "escaped",
    "never",
  ],
};

type Option = "always" | "escaped" | "never";

interface Options
{
  readonly comment: Option;
  readonly identifier: Option;
  readonly string: Option;
  readonly template: Option;
}


export class Rule
extends Lint.Rules.AbstractRule
{
  static metadata: Lint.IRuleMetadata = {
    ruleName: "no-unicode",
    description: "Disallows use of non-ASCII characters.",
    descriptionDetails: Lint.Utils.dedent`
      This rule disallows the use of characters other than printable ASCII
      (U+0020 - U+007E) and standard whitespace (CR, LF, TAB) anywhere within
      the source file.
    `,
    rationale: Lint.Utils.dedent`
    `,
    optionsDescription: Lint.Utils.dedent`
      What this rule does with non-ASCII characters can be configured
      independently for each of the contexts in which ECMAScript allows them.

      The supported behaviors are:
      * \`always\` does nothing
      * \`never\` generates a warning
      * \`escaped\` generates a warning including advice on how to correctly
        escape the offending character and a fix to do so automatically

      The supported contexts are:
      * \`comment\` for basic single- and multi-line comments
      * \`identifier\` for all identifiers
      * \`string\` for string literals
      * \`template\` for template literals

      The defaults are:
      \`\`\`{
        "comment": "always",
        "identifier": "never",
        "string": "escaped",
        "template": "escaped",
      }
      \`\`\`
    `,
    options: {
      type: "object",
      properties: {
        comment: OPTION,
        identifier: OPTION,
        string: OPTION,
        template: OPTION,
      },
    },
    type: "style",
    typescriptOnly: false,
    hasFix: true,
  };


  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new Walker(sourceFile, this.getOptions()),
    );
  }
}

interface Problem
{
  pos: number;
  len: number;
  value: string;
}


function escapeUnicode(raw: string): string {
  let result = "";
  for (const character of raw) {
    const codepoint = character.codePointAt(0);
    if (codepoint) {
      result = `${result}\\u{${codepoint.toString(16)}}`;
    }
  }
  return result;
}

const PATTERN = /[^\r\n\t\x20-\x7E]/mg;

function forEachProhibitedCharacter(
  text: string,
  callback: (problem: Problem) => void,
): void {
  let match;
  // tslint:disable-next-line:no-conditional-assignment
  while (match = PATTERN.exec(text)) {
    callback({
      pos: match.index,
      len: match[0].length,
      value: match[0],
    });
  }
}


class Walker
extends Lint.RuleWalker {
  private config: Options;
  private file?: ts.SourceFile;
  private problems: Problem[] = [];

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);

    function config<T>(key: string, def: T): T {
      const opts = options.ruleArguments[0];
      if (opts && opts[key]) {
        return opts[key];
      } else {
        return def;
      }
    }

    this.config = {
      comment:    config("comment",    "always"),
      identifier: config("identifier", "never"),
      string:     config("string",     "escaped"),
      template:   config("template",   "escaped"),
    };
  }


  private addProhibitedFailure(problem: Problem, context: string): void {
    this.addFailureAt(
      problem.pos,
      problem.len,
      `non-ASCII characters in ${context} are disallowed`,
    );
  }

  private addEscapeRequiredFailure(problem: Problem, context: string): void {
    const escaped = escapeUnicode(problem.value);
    this.addFailureAt(
      problem.pos,
      problem.len,
      `unescaped non-ASCII characters in ${context} are disallowed, `
        + `use escape sequence "${escaped}"`,
      this.createReplacement(problem.pos, problem.len, escaped),
    );
  }

  private maybeAddFailure(
    problem: Problem,
    config: Option,
    context: string,
  ): void {
    if ("never" === config) {
      this.addProhibitedFailure(problem, context);
    } else if ("escaped" === config) {
      this.addEscapeRequiredFailure(problem, context);
    }
  }


  protected visitSourceFile(node: ts.SourceFile): void {
    this.file = node;
    this.problems = [];

    forEachProhibitedCharacter(this.file.text, (problem) => {
      this.problems.push(problem);
    });

    super.visitSourceFile(node);

    for (const problem of this.problems) {
      this.addProhibitedFailure(problem, "unknown context");
    }
  }


  private handleProblemsForRange(
    start: number,
    end: number,
    callback: (problem: Problem) => void,
  ): void {
    this.problems = this.problems.filter((problem) => {
      if (problem.pos >= start && problem.pos <= end) {
        callback(problem);
        return false;
      } else {
        return true;
      }
    });
  }

  private handleProblemsForNode(
    node: ts.Node,
    callback: (problem: Problem) => void,
  ): void {
    this.handleProblemsForRange(
      node.getStart(this.file),
      node.getEnd(),
      callback,
    );
  }


  protected visitIdentifier(node: ts.Identifier): void {
    super.visitIdentifier(node);

    this.handleProblemsForNode(node, (problem) => {
      this.maybeAddFailure(problem, this.config.identifier, "identifiers");
    });
  }

  protected visitStringLiteral(node: ts.StringLiteral): void {
    super.visitStringLiteral(node);

    this.handleProblemsForNode(node, (problem) => {
      this.maybeAddFailure(problem, this.config.string, "string literals");
    });
  }

  protected visitNoSubstitutionTemplateLiteral(
    node: ts.NoSubstitutionTemplateLiteral,
  ): void {
    this.handleProblemsForNode(node, (problem) => {
      this.maybeAddFailure(problem, this.config.template, "template literals");
    });
  }

  protected visitTemplateExpression(node: ts.TemplateExpression): void {
    super.visitTemplateExpression(node);

    [ node.head,
      ...node.templateSpans.map((span) => span.literal),
    ].forEach((literal) => {
      this.handleProblemsForNode(literal, (problem) => {
        this.maybeAddFailure(
          problem,
          this.config.template,
          "template literals",
        );
      });
    });
  }

  protected visitComment(comment: ts.CommentRange): void {
    this.handleProblemsForRange(comment.pos, comment.end, (problem) => {
      this.maybeAddFailure(
        { ...problem,
          pos: comment.pos + problem.pos,
        },
        this.config.comment,
        "comments",
      );
    });
  }


  protected visitNode(node: ts.Node): void {
    if (node.parent) {
      if (this.file == null) throw new Error("missed call to visitSourceFile");

      const callback = (
        pos: number,
        end: number,
        kind: ts.CommentKind,
        hasTrailingNewLine: boolean,
      ) => {
        this.visitComment({pos, end, kind, hasTrailingNewLine});
      };

      ts.forEachLeadingCommentRange(this.file.text, node.pos, callback);
      ts.forEachTrailingCommentRange(this.file.text, node.pos, callback);
    }

    switch (node.kind) {
      case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        this.visitNoSubstitutionTemplateLiteral(
          (node as ts.NoSubstitutionTemplateLiteral),
        );
        break;
    }

    super.visitNode(node);
  }
}
