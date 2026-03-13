/**
 * Скрипт сканирует src/*.ts, собирает экспорты и их JSDoc, генерирует документацию в docs/.
 * Запуск: pnpm run docs:generate
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";

const SRC_DIR = path.join(process.cwd(), "src");
const DOCS_DIR = path.join(process.cwd(), "docs");
const API_DOCS_BASE = path.join(DOCS_DIR, "api");

interface ExportDoc {
  name: string;
  kind: "function" | "const" | "class" | "type" | "interface" | "enum";
  /** true если экспорт — функция (для const проверяем initializer) */
  callable?: boolean;
  description: string;
  examples: string[];
  deprecated?: string;
}

function sanitizeMarkdown(text: string): string {
  // Заменяем {name} на `name`, чтобы VitePress не пытался интерполировать Vue-выражения.
  return text.replace(/\{([^}]+)\}/g, (_m, name) => `\`${String(name)}\``);
}

function getCommentText(
  comment: string | ts.NodeArray<ts.JSDocComment> | undefined,
  sourceFile: ts.SourceFile
): string {
  if (!comment) return "";
  if (typeof comment === "string") return sanitizeMarkdown(comment.trim());
  const joined = comment
    .map((node) => {
      if (ts.isJSDocText(node)) return node.text;
      if ("text" in node && typeof (node as { text: string }).text === "string")
        return (node as { text: string }).text;
      return "";
    })
    .join("")
    .trim();
  return sanitizeMarkdown(joined);
}

function displayPartsToText(parts: ts.SymbolDisplayPart[] | undefined): string {
  if (!parts?.length) return "";
  return parts.map((p) => p.text).join("").trim();
}

function jsDocTagText(tag: ts.JSDocTagInfo): string {
  const t = tag.text;
  if (typeof t === "string") return sanitizeMarkdown(t.trim());
  return sanitizeMarkdown(displayPartsToText(t) || "");
}

function extractJSDocFromSymbol(
  symbol: ts.Symbol | undefined,
  typeChecker: ts.TypeChecker
): { description: string; examples: string[]; deprecated?: string } {
  const result = { description: "", examples: [] as string[], deprecated: undefined as string | undefined };
  if (!symbol) return result;
  const docComment = symbol.getDocumentationComment(typeChecker);
  result.description = displayPartsToText(docComment) || "";
  const tags = symbol.getJsDocTags(typeChecker);
  for (const tag of tags) {
    if (tag.name === "example") {
      const code = jsDocTagText(tag);
      if (code) result.examples.push(code);
    } else if (tag.name === "deprecated") {
      result.deprecated = jsDocTagText(tag);
    }
  }
  return result;
}

function extractJSDoc(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  typeChecker?: ts.TypeChecker,
  symbolNode?: ts.Node
): {
  description: string;
  examples: string[];
  deprecated?: string;
} {
  const result = { description: "", examples: [] as string[], deprecated: undefined as string | undefined };
  const docs = ts.getJSDocCommentsAndTags(node);
  for (const d of docs) {
    if (d.kind === ts.SyntaxKind.JSDoc) {
      const jsdoc = d as ts.JSDoc;
      result.description = getCommentText(jsdoc.comment, sourceFile);
      if (jsdoc.tags) {
        for (const tag of jsdoc.tags) {
          const name = tag.tagName.getText(sourceFile);
          if (name === "example") {
            const code = getCommentText(tag.comment, sourceFile);
            if (code) result.examples.push(code);
          } else if (name === "deprecated") {
            result.deprecated = getCommentText(tag.comment, sourceFile);
          }
        }
      }
      break;
    }
  }
  if (result.description === "" && typeChecker && symbolNode) {
    const symbol = typeChecker.getSymbolAtLocation(symbolNode);
    const fromSymbol = extractJSDocFromSymbol(symbol, typeChecker);
    result.description = fromSymbol.description;
    if (fromSymbol.examples.length) result.examples = fromSymbol.examples;
    if (fromSymbol.deprecated != null) result.deprecated = fromSymbol.deprecated;
  }
  return result;
}

function collectExports(
  sourceFile: ts.SourceFile,
  program: ts.Program
): ExportDoc[] {
  const typeChecker = program.getTypeChecker();
  const exports: ExportDoc[] = [];

  function visit(node: ts.Node) {
    // export const/let/var x = ..., y = ...
    if (ts.isVariableStatement(node)) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExport && node.declarationList) {
        for (const decl of node.declarationList.declarations) {
          const name = decl.name;
          if (ts.isIdentifier(name)) {
            const initializer = decl.initializer;
            const callable =
              initializer != null &&
              (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer));
            const jsdoc = extractJSDoc(
              node,
              sourceFile,
              typeChecker,
              decl.name
            );
            exports.push({
              name: name.getText(sourceFile),
              kind: "const",
              callable,
              description: jsdoc.description,
              examples: jsdoc.examples,
              deprecated: jsdoc.deprecated,
            });
          }
        }
      }
      return;
    }

    if (ts.isFunctionDeclaration(node)) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExport && node.name) {
        const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
        exports.push({
          name: node.name.getText(sourceFile),
          kind: "function",
          callable: true,
          description: jsdoc.description,
          examples: jsdoc.examples,
          deprecated: jsdoc.deprecated,
        });
      }
      return;
    }

    if (ts.isClassDeclaration(node) && node.name) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExport) {
        const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
        exports.push({
          name: node.name.getText(sourceFile),
          kind: "class",
          description: jsdoc.description,
          examples: jsdoc.examples,
          deprecated: jsdoc.deprecated,
        });
      }
      return;
    }

    if (ts.isTypeAliasDeclaration(node)) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExport && node.name) {
        const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
        exports.push({
          name: node.name.getText(sourceFile),
          kind: "type",
          description: jsdoc.description,
          examples: jsdoc.examples,
          deprecated: jsdoc.deprecated,
        });
      }
      return;
    }

    if (ts.isInterfaceDeclaration(node)) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExport && node.name) {
        const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
        exports.push({
          name: node.name.getText(sourceFile),
          kind: "interface",
          description: jsdoc.description,
          examples: jsdoc.examples,
          deprecated: jsdoc.deprecated,
        });
      }
      return;
    }

    if (ts.isEnumDeclaration(node) && node.name) {
      const hasExport = node.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExport) {
        const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
        exports.push({
          name: node.name.getText(sourceFile),
          kind: "enum",
          description: jsdoc.description,
          examples: jsdoc.examples,
          deprecated: jsdoc.deprecated,
        });
      }
      return;
    }

    // export { a, b } from '...' — пропускаем реэкспорты без JSDoc в этом файле
    if (ts.isExportDeclaration(node)) return;

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}

function toMarkdownSection(doc: ExportDoc, namespacePrefix = ""): string {
  const suffix = doc.callable === true ? "()" : "";
  const heading = `### ${namespacePrefix}${doc.name}${suffix}`;
  const dep =
    doc.deprecated != null && doc.deprecated !== ""
      ? `\n**Deprecated:** ${doc.deprecated}\n`
      : "";
  const desc =
    doc.description !== ""
      ? `\n${doc.description}\n`
      : "\n_No description._\n";
  let examples = "";
  if (doc.examples.length > 0) {
    examples =
      "\n**Example:**\n\n```ts\n" +
      doc.examples.join("\n\n").trim() +
      "\n```\n";
  }
  return heading + dep + desc + examples;
}

function generateExportPageMarkdown(doc: ExportDoc, namespacePrefix = ""): string {
  const suffix = doc.callable === true ? "()" : "";
  const heading = `# ${namespacePrefix}${doc.name}${suffix}`;
  const dep =
    doc.deprecated != null && doc.deprecated !== ""
      ? `\n**Deprecated:** ${doc.deprecated}\n`
      : "";
  const desc =
    doc.description !== ""
      ? `\n${doc.description}\n`
      : "\n_No description._\n";
  let examples = "";
  if (doc.examples.length > 0) {
    examples =
      "\n**Example:**\n\n```ts\n" +
      doc.examples.join("\n\n").trim() +
      "\n```\n";
  }
  return heading + dep + desc + examples;
}

type SidebarTreeNode =
  | { link: string; title: string }
  | { children: Map<string, SidebarTreeNode> };

function buildSidebarTree(
  flat: Array<{ path: string; displayName: string }>
): Array<{ text: string; link?: string; items?: Array<{ text: string; link?: string; items?: unknown[] }> }> {
  const root: { children: Map<string, SidebarTreeNode> } = { children: new Map() };

  // Специальный кейс: barrel-неймспейсы format и parser ведут себя как typeGuard —
  // в сайдбаре только один пункт (format / parser), без вложенных модулей.
  const filteredFlat = flat.filter(({ path: fullPath }) => {
    const rel = fullPath.replace(/^\/api\/?/, "");
    if (rel.startsWith("format/")) return false;
    if (rel.startsWith("parser/")) return false;
    return true;
  });

  for (const { path: fullPath, displayName } of filteredFlat) {
    const relPath = fullPath.replace(/^\/api\/?/, "");
    const segments = relPath.split("/").filter(Boolean);
    // Один сегмент (например async) → группа с именем сегмента, внутри — пункт с displayName (sleep)
    if (segments.length === 1) {
      const groupKey = segments[0];
      if (!root.children.has(groupKey)) {
        root.children.set(groupKey, { children: new Map() });
      }
      const group = root.children.get(groupKey)!;
      if ("children" in group) {
        group.children.set(displayName, { link: fullPath, title: displayName });
      } else {
        const newGroup: { children: Map<string, SidebarTreeNode> } = { children: new Map() };
        newGroup.children.set(displayName, { link: fullPath, title: displayName });
        root.children.set(groupKey, newGroup);
      }
      continue;
    }
    let current: { children: Map<string, SidebarTreeNode> } = root;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const isLast = i === segments.length - 1;
      if (isLast) {
        current.children.set(seg, { link: fullPath, title: displayName });
        break;
      }
      if (!current.children.has(seg)) {
        current.children.set(seg, { children: new Map() });
      }
      const next = current.children.get(seg)!;
      if ("children" in next) {
        current = next;
      } else {
        const newChild: { children: Map<string, SidebarTreeNode> } = { children: new Map() };
        current.children.set(seg, newChild);
        current = newChild;
      }
    }
  }

  function toSidebarItems(
    node: { children: Map<string, SidebarTreeNode> }
  ): Array<{ text: string; link?: string; items?: unknown[] }> {
    const entries = Array.from(node.children.entries()).sort(([a], [b]) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    return entries.flatMap(([key, value]) => {
      if ("link" in value) {
        return [{ text: value.title, link: value.link }];
      }
      const items = toSidebarItems(value);
      // Сворачиваем только barrel: группа и единственный ребёнок с тем же именем (typeGuard → typeGuard)
      const singleLeaf = items.length === 1 && items[0].link != null;
      const childSameAsGroup = singleLeaf && items[0].text === key;
      if (singleLeaf && childSameAsGroup) {
        return [items[0]];
      }
      return [{ text: key, items }];
    });
  }

  return toSidebarItems(root);
}

function generateGroupMarkdown(
  filePath: string,
  exportDocs: ExportDoc[],
  options?: { namespacePrefix?: string; pageTitle?: string }
): string {
  const title =
    options?.pageTitle ??
    path
      .basename(filePath, path.extname(filePath))
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const prefix = options?.namespacePrefix ?? "";
  const sections = exportDocs.map((d) => toMarkdownSection(d, prefix)).join("\n\n");
  return `# ${title}\n\n${sections}\n`;
}

/** Проверяет, что index.ts — barrel: import * as name from './_exports.js'; export { name }; */
function detectBarrelNamespace(indexSourceFile: ts.SourceFile): string | null {
  let namespaceName: string | null = null;
  for (const stmt of indexSourceFile.statements) {
    if (ts.isImportDeclaration(stmt)) {
      const spec = stmt.moduleSpecifier;
      const specText =
        ts.isStringLiteral(spec) ? spec.text : (spec as { text?: string }).text ?? "";
      if (specText.includes("_exports")) {
        const clause = stmt.importClause;
        if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
          namespaceName = clause.namedBindings.name.getText(indexSourceFile);
        }
      }
    }
    if (ts.isExportDeclaration(stmt) && stmt.exportClause && ts.isNamedExports(stmt.exportClause)) {
      const names = stmt.exportClause.elements.map((e) => e.name.getText(indexSourceFile));
      if (namespaceName && names.length === 1 && names[0] === namespaceName) {
        return namespaceName;
      }
    }
  }
  return null;
}

function main() {
  const configPath = ts.findConfigFile(
    process.cwd(),
    ts.sys.fileExists,
    "tsconfig.json"
  );
  if (!configPath) {
    console.error("tsconfig.json not found");
    process.exit(1);
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  );

  const compilerOptions: ts.CompilerOptions = {
    ...parsed.options,
    noEmit: true,
    jsDocParsingMode: ts.JSDocParsingMode.ParseAll,
  };

  const program = ts.createProgram(parsed.fileNames, compilerOptions);

  const sourceFiles = program.getSourceFiles().filter((f) => {
    const full = f.fileName;
    if (!full.includes(SRC_DIR) && !path.isAbsolute(full)) return false;
    if (full.endsWith(".test.ts")) return false;
    if (full.includes("node_modules")) return false;
    return full.startsWith(SRC_DIR);
  });

  if (!fs.existsSync(API_DOCS_BASE)) {
    fs.mkdirSync(API_DOCS_BASE, { recursive: true });
  }

  const generatedGroups: { path: string; displayName: string }[] = [];
  const barrelDirs = new Set<string>();

  const collectBarrelExports = (dirName: string): ExportDoc[] => {
    const result: ExportDoc[] = [];
    for (const sf of sourceFiles) {
      const rel = path.relative(SRC_DIR, sf.fileName).replace(/\\/g, "/");
      if (!rel.startsWith(`${dirName}/`)) continue;
      const base = path.basename(rel);
      if (base === "index.ts" || base === "_exports.ts" || base.endsWith(".test.ts")) continue;
      result.push(...collectExports(sf, program));
    }
    return result;
  };

  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(SRC_DIR, sourceFile.fileName);
    if (relativePath.startsWith("..")) continue;

    const groupPath = relativePath.replace(/\.tsx?$/, "");
    const dirName = path.dirname(groupPath);
    const baseName = path.basename(groupPath);

    // Пропускаем _exports.ts, если в этой папке barrel index.ts (доку соберём из index)
    if (baseName === "_exports" && dirName !== "") {
      const indexRel = path.join(dirName, "index.ts");
      const indexFile = sourceFiles.find((f) => {
        const r = path.relative(SRC_DIR, f.fileName);
        return r === indexRel || r.replace(/\\/g, "/") === indexRel.replace(/\\/g, "/");
      });
      if (indexFile && detectBarrelNamespace(indexFile)) {
        continue;
      }
    }

    // Barrel: index.ts с import * as X from './_exports.js' и export { X }
    if (baseName === "index" && dirName !== "") {
      const namespaceName = detectBarrelNamespace(sourceFile);
      if (namespaceName) {
        const exportsRel = path.join(dirName, "_exports.ts");
        const exportsFile = sourceFiles.find((f) => {
          const r = path.relative(SRC_DIR, f.fileName);
          return r === exportsRel || r.replace(/\\/g, "/") === exportsRel.replace(/\\/g, "/");
        });
        if (exportsFile) {
          let exportDocs = collectExports(exportsFile, program);
          if (exportDocs.length === 0) {
            // _exports.ts может содержать только export * from './x';
            // тогда берём реальные экспорты из дочерних файлов директории.
            exportDocs = collectBarrelExports(dirName);
          }
          if (exportDocs.length === 0) {
            continue;
          }
          const docDir = path.join(API_DOCS_BASE, namespaceName);
          fs.mkdirSync(docDir, { recursive: true });
          const md = generateGroupMarkdown(exportsFile.fileName, exportDocs, {
            namespacePrefix: `${namespaceName}.`,
            pageTitle: namespaceName,
          });
          fs.writeFileSync(path.join(docDir, "index.md"), md, "utf-8");
          const exportsDocDir = path.join(API_DOCS_BASE, dirName, "_exports");
          if (fs.existsSync(exportsDocDir)) {
            fs.rmSync(exportsDocDir, { recursive: true });
          }
          barrelDirs.add(dirName);
          generatedGroups.push({ path: `/api/${namespaceName}`, displayName: namespaceName });
          continue;
        }
      }
    }

    const exportDocs = collectExports(sourceFile, program);
    if (exportDocs.length === 0) continue;

    const segments = groupPath.split("/");
    const topDir = segments[0];

    const dir = path.join(API_DOCS_BASE, groupPath);
    const indexPath = path.join(dir, "index.md");

    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    const md = generateGroupMarkdown(sourceFile.fileName, exportDocs);
    fs.writeFileSync(indexPath, md, "utf-8");

    const isBarrelChild = dirName !== "" && barrelDirs.has(dirName);

    // Для модулей внутри barrel-директорий (format, parser, type-guard и т.п.) — только namespace.
    if (isBarrelChild) {
      continue;
    }

    // Для react-модулей: по одному пункту на файл, имя берём из экспорта, ссылка на файл.
    if (topDir === "react") {
      const nameFromFile = baseName.replace(/-([a-z])/gi, (_, c) => c.toUpperCase());
      const displayName =
        exportDocs.find((e) => e.name === nameFromFile)?.name ?? exportDocs[0].name;
      generatedGroups.push({
        path: `/api/${groupPath}`,
        displayName,
      });
      continue;
    }

    // Для остальных модулей: отдельная страница и пункт сайдбара на каждый экспорт.
    for (const doc of exportDocs) {
      const exportGroupPath = path.join(API_DOCS_BASE, groupPath, doc.name);
      const exportIndexPath = path.join(exportGroupPath, "index.md");
      fs.mkdirSync(exportGroupPath, { recursive: true });
      const exportMd = generateExportPageMarkdown(doc);
      fs.writeFileSync(exportIndexPath, exportMd, "utf-8");

      const pathApi = `/api/${groupPath}/${doc.name}`;
      generatedGroups.push({ path: pathApi, displayName: doc.name });
    }
  }

  // Строим иерархию для сайдбара: подпись = имя экспорта (например applyObservable)
  const sidebarNested = buildSidebarTree(generatedGroups);
  const sidebarMetaPath = path.join(API_DOCS_BASE, "_sidebar.json");
  fs.writeFileSync(
    sidebarMetaPath,
    JSON.stringify(sidebarNested, null, 2),
    "utf-8"
  );

  console.log(
    `Generated API docs for ${generatedGroups.length} modules in ${API_DOCS_BASE}`
  );
}

main();
