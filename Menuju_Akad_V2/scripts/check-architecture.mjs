import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import ts from "typescript";

const root = resolve("src");
const errors = [];
const graph = new Map();
async function list(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries
      .filter((entry) => entry.name !== "generated")
      .map((entry) =>
        entry.isDirectory()
          ? list(resolve(directory, entry.name))
          : [resolve(directory, entry.name)],
      ),
  );
  return groups.flat();
}
for (const file of await list(root)) {
  if (!/\.(ts|tsx|css)$/.test(file)) continue;
  const source = await readFile(file, "utf8");
  const lines = source.trimEnd().split("\n").length;
  if (lines > 200) errors.push(`${relative(root, file)}: ${lines} lines exceeds 200`);
  if (!/\.(ts|tsx)$/.test(file)) continue;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const client = tree.statements.some(
    (node) =>
      ts.isExpressionStatement(node) &&
      ts.isStringLiteral(node.expression) &&
      node.expression.text === "use client",
  );
  const dependencies = [];
  const specifiers = [];
  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      specifiers.push(node.moduleSpecifier.text);
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    )
      specifiers.push(node.arguments[0].text);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  for (const name of specifiers) {
    const base = name.startsWith("@/")
      ? resolve(root, name.slice(2))
      : name.startsWith(".")
        ? resolve(dirname(file), name)
        : null;
    const target =
      base &&
      ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]
        .map((suffix) => base + suffix)
        .find(existsSync);
    if (target) dependencies.push(target);
    const path = target ? relative(root, target).replaceAll("\\", "/") : name;
    const ownPath = relative(root, file).replaceAll("\\", "/");
    if (
      client &&
      /(^server\/|\/(services|queries|repositories)\/|^generated\/|^@prisma\/|^@neondatabase\/)/.test(
        path,
      )
    )
      errors.push(`${ownPath}: Client Component imports server module ${name}`);
    if (
      /^(features|components)\//.test(ownPath) &&
      !ownPath.endsWith(".test.ts") &&
      /(^preview\/|\/fixtures\/)/.test(path)
    )
      errors.push(`${ownPath}: fixture dependency ${name}`);
    if (
      ownPath.endsWith(".tsx") &&
      /(^@prisma\/|^@neondatabase\/|^generated\/|^server\/(env|db))/.test(path)
    )
      errors.push(`${ownPath}: UI database/env dependency ${name}`);
    if (ownPath.startsWith("components/ui/") && path.startsWith("features/"))
      errors.push(`${ownPath}: primitive imports feature ${name}`);
  }
  graph.set(file, dependencies);
  if (
    /(^|\/)(services|queries|repositories)\//.test(relative(root, file)) &&
    !file.endsWith(".test.ts") &&
    !source.includes('"server-only"')
  )
    errors.push(`${relative(root, file)}: server-only marker required`);
}
const active = new Set();
const done = new Set();
function walk(file, chain = []) {
  if (active.has(file)) {
    errors.push(`cycle: ${[...chain, file].map((item) => relative(root, item)).join(" -> ")}`);
    return;
  }
  if (done.has(file)) return;
  active.add(file);
  for (const dependency of graph.get(file) ?? []) walk(dependency, [...chain, file]);
  active.delete(file);
  done.add(file);
}
for (const file of graph.keys()) walk(file);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(`Architecture passed: ${graph.size} modules, ≤200 lines, boundaries and cycles.`);
