// Shared helper: find user-facing text ranges (string literals, template chunks, JSX text) in a TS/TSX file.
import ts from "typescript";
import fs from "node:fs";

export function textRanges(file, src = fs.readFileSync(file, "utf8")) {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out = [];
  const visit = (n) => {
    const k = n.kind;
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return;
    if (k === ts.SyntaxKind.StringLiteral || k === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
      const p = n.parent;
      const isKey = p && (ts.isPropertyAssignment(p) && p.name === n);
      const isAttrName = p && ts.isJsxAttribute(p) && /^(className|href|src|id|key|style|d|viewBox|fill|stroke|transform)$/.test(p.name.getText(sf));
      const isIndex = p && ts.isElementAccessExpression(p);
      const isCompare = p && ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(p.operatorToken.kind);
      const isType = p && ts.isLiteralTypeNode(p);
      if (!isKey && !isAttrName && !isIndex && !isCompare && !isType) out.push({ start: n.getStart(sf) + 1, end: n.getEnd() - 1, kind: "str" });
    } else if (k === ts.SyntaxKind.TemplateHead || k === ts.SyntaxKind.TemplateMiddle || k === ts.SyntaxKind.TemplateTail) {
      const s = n.getStart(sf), e = n.getEnd();
      const startOff = k === ts.SyntaxKind.TemplateHead ? 1 : 1; // ` or }
      const endOff = k === ts.SyntaxKind.TemplateTail ? 1 : 2; // ` or ${
      out.push({ start: s + startOff, end: e - endOff, kind: "tpl" });
    } else if (k === ts.SyntaxKind.JsxText) {
      out.push({ start: n.getStart(sf), end: n.getEnd(), kind: "jsx" });
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return { src, ranges: out.filter((r) => r.end > r.start) };
}
