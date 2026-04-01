/**
 * Скрипт сканирует src/*.ts, собирает экспорты и их JSDoc, генерирует документацию в docs/.
 * Запуск: pnpm run docs:generate
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';

const SRC_DIR = path.join(process.cwd(), 'src');
const DOCS_DIR = path.join(process.cwd(), 'docs');
const API_DOCS_BASE = path.join(DOCS_DIR, 'api');

interface ExportDoc {
  name: string;
  kind: 'function' | 'const' | 'class' | 'type' | 'interface' | 'enum';
  /** true если экспорт — функция (для const проверяем initializer) */
  callable?: boolean;
  description: string;
  examples: string[];
  deprecated?: string;
}

function sanitizeMarkdown(text: string): string {
  // Заменяем {name} на `name`, чтобы VitePress не пытался интерполировать Vue-выражения.
  let result = text.replace(
    /\{([^}]+)\}/g,
    (_m, name) => `\`${String(name)}\``,
  );
  // Экранируем угловые скобки, чтобы <T> и подобные не воспринимались как HTML-теги.
  result = result.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return result;
}

function getRawCommentText(
  comment: string | ts.NodeArray<ts.JSDocComment> | undefined,
  _sourceFile: ts.SourceFile,
): string {
  if (!comment) return '';
  if (typeof comment === 'string') return comment.trim();
  return comment
    .map((node) => {
      if (node.kind === ts.SyntaxKind.JSDocText) {
        return (node as ts.JSDocText).text;
      }
      if ('text' in node && typeof (node as { text: string }).text === 'string')
        return (node as { text: string }).text;
      return '';
    })
    .join('')
    .trim();
}

function getCommentText(
  comment: string | ts.NodeArray<ts.JSDocComment> | undefined,
  sourceFile: ts.SourceFile,
): string {
  return sanitizeMarkdown(getRawCommentText(comment, sourceFile));
}

function displayPartsToText(parts: ts.SymbolDisplayPart[] | undefined): string {
  if (!parts?.length) return '';
  return parts
    .map((p) => p.text)
    .join('')
    .trim();
}

function jsDocTagText(tag: ts.JSDocTagInfo): string {
  const raw =
    typeof (tag.text as unknown) === 'string'
      ? String(tag.text)
      : displayPartsToText(tag.text as ts.SymbolDisplayPart[] | undefined);
  return sanitizeMarkdown(raw.trim());
}

function jsDocTagRawText(tag: ts.JSDocTagInfo): string {
  const raw =
    typeof (tag.text as unknown) === 'string'
      ? String(tag.text)
      : displayPartsToText(tag.text as ts.SymbolDisplayPart[] | undefined);
  return raw.trim();
}

function normalizeExample(example: string): { lang: string; code: string } {
  const trimmed = example.trim();
  const fencedMatch = trimmed.match(/^```([\w-]+)?\n([\s\S]*?)\n```$/);
  if (fencedMatch) {
    return {
      lang: fencedMatch[1] || 'ts',
      code: fencedMatch[2].trim(),
    };
  }
  return {
    lang: 'ts',
    code: trimmed,
  };
}

function renderExamples(examples: string[]): string {
  if (examples.length === 0) return '';
  const blocks = examples
    .map((example) => {
      const normalized = normalizeExample(example);
      return `\`\`\`${normalized.lang}\n${normalized.code}\n\`\`\``;
    })
    .join('\n\n');
  const title = examples.length === 1 ? '**Example:**' : '**Examples:**';
  return `\n${title}\n\n${blocks}\n`;
}

function extractJSDocFromSymbol(
  symbol: ts.Symbol | undefined,
  typeChecker: ts.TypeChecker,
): { description: string; examples: string[]; deprecated?: string } {
  const result = {
    description: '',
    examples: [] as string[],
    deprecated: undefined as string | undefined,
  };
  if (!symbol) return result;
  const docComment = symbol.getDocumentationComment(typeChecker);
  result.description = displayPartsToText(docComment) || '';
  const tags = symbol.getJsDocTags(typeChecker);
  for (const tag of tags) {
    if (tag.name === 'example') {
      const code = jsDocTagRawText(tag);
      if (code) result.examples.push(code);
    } else if (tag.name === 'deprecated') {
      result.deprecated = jsDocTagText(tag);
    }
  }
  return result;
}

function applyJSDocBlockToResult(
  jsdoc: ts.JSDoc,
  sourceFile: ts.SourceFile,
  result: {
    description: string;
    examples: string[];
    deprecated?: string;
  },
): void {
  result.description = getCommentText(jsdoc.comment, sourceFile);
  if (!jsdoc.tags) return;
  for (const tag of jsdoc.tags) {
    const name = tag.tagName.getText(sourceFile);
    if (name === 'example') {
      const code = getRawCommentText(tag.comment, sourceFile);
      if (code) result.examples.push(code);
    } else if (name === 'deprecated') {
      result.deprecated = getCommentText(tag.comment, sourceFile);
    }
  }
}

function extractJSDoc(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  typeChecker?: ts.TypeChecker,
  symbolNode?: ts.Node,
): {
  description: string;
  examples: string[];
  deprecated?: string;
} {
  const result = {
    description: '',
    examples: [] as string[],
    deprecated: undefined as string | undefined,
  };
  const docs = ts.getJSDocCommentsAndTags(node);
  for (const d of docs) {
    if (d.kind === ts.SyntaxKind.JSDoc) {
      applyJSDocBlockToResult(d as ts.JSDoc, sourceFile, result);
      break;
    }
  }
  if (result.description === '' && typeChecker && symbolNode) {
    const symbol = typeChecker.getSymbolAtLocation(symbolNode);
    const fromSymbol = extractJSDocFromSymbol(symbol, typeChecker);
    result.description = fromSymbol.description;
    if (fromSymbol.examples.length) result.examples = fromSymbol.examples;
    if (fromSymbol.deprecated != null)
      result.deprecated = fromSymbol.deprecated;
  }
  return result;
}

function collectExports(
  sourceFile: ts.SourceFile,
  program: ts.Program,
): ExportDoc[] {
  const typeChecker = program.getTypeChecker();
  const exports: ExportDoc[] = [];

  const isExported = (node: ts.Node): boolean =>
    node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ??
    false;

  function visitExportedVariables(node: ts.VariableStatement) {
    if (!isExported(node) || !node.declarationList) return;
    for (const decl of node.declarationList.declarations) {
      const name = decl.name;
      if (!ts.isIdentifier(name)) continue;
      const initializer = decl.initializer;
      const callable =
        initializer != null &&
        (ts.isArrowFunction(initializer) ||
          ts.isFunctionExpression(initializer));
      const jsdoc = extractJSDoc(node, sourceFile, typeChecker, decl.name);
      exports.push({
        name: name.getText(sourceFile),
        kind: 'const',
        callable,
        description: jsdoc.description,
        examples: jsdoc.examples,
        deprecated: jsdoc.deprecated,
      });
    }
  }

  function visitExportedFunction(node: ts.FunctionDeclaration) {
    if (!isExported(node) || !node.name) return;
    const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
    exports.push({
      name: node.name.getText(sourceFile),
      kind: 'function',
      callable: true,
      description: jsdoc.description,
      examples: jsdoc.examples,
      deprecated: jsdoc.deprecated,
    });
  }

  function visitExportedClass(node: ts.ClassDeclaration) {
    if (!node.name || !isExported(node)) return;
    const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
    exports.push({
      name: node.name.getText(sourceFile),
      kind: 'class',
      description: jsdoc.description,
      examples: jsdoc.examples,
      deprecated: jsdoc.deprecated,
    });
  }

  function visitExportedTypeAlias(node: ts.TypeAliasDeclaration) {
    if (!isExported(node) || !node.name) return;
    const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
    exports.push({
      name: node.name.getText(sourceFile),
      kind: 'type',
      description: jsdoc.description,
      examples: jsdoc.examples,
      deprecated: jsdoc.deprecated,
    });
  }

  function visitExportedInterface(node: ts.InterfaceDeclaration) {
    if (!isExported(node) || !node.name) return;
    const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
    exports.push({
      name: node.name.getText(sourceFile),
      kind: 'interface',
      description: jsdoc.description,
      examples: jsdoc.examples,
      deprecated: jsdoc.deprecated,
    });
  }

  function visitExportedEnum(node: ts.EnumDeclaration) {
    if (!node.name || !isExported(node)) return;
    const jsdoc = extractJSDoc(node, sourceFile, typeChecker, node.name);
    exports.push({
      name: node.name.getText(sourceFile),
      kind: 'enum',
      description: jsdoc.description,
      examples: jsdoc.examples,
      deprecated: jsdoc.deprecated,
    });
  }

  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node)) {
      visitExportedVariables(node);
      return;
    }
    if (ts.isFunctionDeclaration(node)) {
      visitExportedFunction(node);
      return;
    }
    if (ts.isClassDeclaration(node)) {
      visitExportedClass(node);
      return;
    }
    if (ts.isTypeAliasDeclaration(node)) {
      visitExportedTypeAlias(node);
      return;
    }
    if (ts.isInterfaceDeclaration(node)) {
      visitExportedInterface(node);
      return;
    }
    if (ts.isEnumDeclaration(node)) {
      visitExportedEnum(node);
      return;
    }
    // export { a, b } from '...' — пропускаем реэкспорты без JSDoc в этом файле
    if (ts.isExportDeclaration(node)) return;

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}

function toMarkdownSection(doc: ExportDoc, namespacePrefix = ''): string {
  const suffix = doc.callable === true ? '()' : '';
  const heading = `### ${namespacePrefix}${doc.name}${suffix}`;
  const dep =
    doc.deprecated != null && doc.deprecated !== ''
      ? `\n**Deprecated:** ${doc.deprecated}\n`
      : '';
  const desc =
    doc.description !== '' ? `\n${doc.description}\n` : '\n_No description._\n';
  const examples = renderExamples(doc.examples);
  return heading + dep + desc + examples;
}

function generateExportPageMarkdown(
  doc: ExportDoc,
  namespacePrefix = '',
): string {
  const suffix = doc.callable === true ? '()' : '';
  const heading = `# ${namespacePrefix}${doc.name}${suffix}`;
  const dep =
    doc.deprecated != null && doc.deprecated !== ''
      ? `\n**Deprecated:** ${doc.deprecated}\n`
      : '';
  const desc =
    doc.description !== '' ? `\n${doc.description}\n` : '\n_No description._\n';
  const examples = renderExamples(doc.examples);
  return heading + dep + desc + examples;
}

type SidebarTreeNode =
  | { link: string; title: string }
  | { children: Map<string, SidebarTreeNode> };

type SidebarItem = {
  text: string;
  link?: string;
  items?: SidebarItem[];
};

function buildSidebarTree(
  flat: Array<{ path: string; displayName: string }>,
): SidebarItem[] {
  const root: { children: Map<string, SidebarTreeNode> } = {
    children: new Map(),
  };

  // Специальный кейс: barrel-неймспейсы format и parser ведут себя как typeGuard —
  // в сайдбаре только один пункт (format / parser), без вложенных модулей.
  const filteredFlat = flat.filter(({ path: fullPath }) => {
    const rel = fullPath.replace(/^\/api\/?/, '');
    if (rel.startsWith('format/')) return false;
    if (rel.startsWith('parser/')) return false;
    return true;
  });

  for (const { path: fullPath, displayName } of filteredFlat) {
    const relPath = fullPath.replace(/^\/api\/?/, '');
    const segments = relPath.split('/').filter(Boolean);
    // Один сегмент (например async) → группа с именем сегмента, внутри — пункт с displayName (sleep)
    if (segments.length === 1) {
      const groupKey = segments[0];
      if (!root.children.has(groupKey)) {
        root.children.set(groupKey, { children: new Map() });
      }
      const group = root.children.get(groupKey)!;
      if ('children' in group) {
        group.children.set(displayName, { link: fullPath, title: displayName });
      } else {
        const newGroup: { children: Map<string, SidebarTreeNode> } = {
          children: new Map(),
        };
        newGroup.children.set(displayName, {
          link: fullPath,
          title: displayName,
        });
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
      if ('children' in next) {
        current = next;
      } else {
        const newChild: { children: Map<string, SidebarTreeNode> } = {
          children: new Map(),
        };
        current.children.set(seg, newChild);
        current = newChild;
      }
    }
  }

  function toSidebarItems(node: {
    children: Map<string, SidebarTreeNode>;
  }): SidebarItem[] {
    const entries = Array.from(node.children.entries()).sort(([a], [b]) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );

    const collectLeafItems = (branch: {
      children: Map<string, SidebarTreeNode>;
    }): Array<{ text: string; link: string }> => {
      const out: Array<{ text: string; link: string }> = [];
      for (const [, childVal] of branch.children.entries()) {
        if ('link' in childVal) {
          out.push({ text: childVal.title, link: childVal.link });
        } else {
          out.push(...collectLeafItems(childVal));
        }
      }
      return out;
    };

    return entries.flatMap(([key, value]) => {
      if ('link' in value) {
        return [{ text: value.title, link: value.link }];
      }

      // Специальный случай для mobx: собираем все листья из подпапок в один плоский список.
      if (key === 'mobx') {
        const leaves = collectLeafItems(value).sort((a, b) =>
          a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }),
        );
        return [{ text: key, items: leaves }];
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
  options?: { namespacePrefix?: string; pageTitle?: string },
): string {
  const title =
    options?.pageTitle ??
    path
      .basename(filePath, path.extname(filePath))
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  const prefix = options?.namespacePrefix ?? '';
  const sections = exportDocs
    .map((d) => toMarkdownSection(d, prefix))
    .join('\n\n');
  return `# ${title}\n\n${sections}\n`;
}

/** Проверяет, что index.ts — barrel: import * as name from './_exports.js'; export { name }; */
function detectBarrelNamespace(indexSourceFile: ts.SourceFile): string | null {
  let namespaceName: string | null = null;
  for (const stmt of indexSourceFile.statements) {
    if (ts.isImportDeclaration(stmt)) {
      const spec = stmt.moduleSpecifier;
      const specText = ts.isStringLiteral(spec)
        ? spec.text
        : ((spec as { text?: string }).text ?? '');
      if (specText.includes('_exports')) {
        const clause = stmt.importClause;
        if (
          clause?.namedBindings &&
          ts.isNamespaceImport(clause.namedBindings)
        ) {
          namespaceName = clause.namedBindings.name.getText(indexSourceFile);
        }
      }
    }
    if (
      ts.isExportDeclaration(stmt) &&
      stmt.exportClause &&
      ts.isNamedExports(stmt.exportClause)
    ) {
      const names = stmt.exportClause.elements.map((e) =>
        e.name.getText(indexSourceFile),
      );
      if (namespaceName && names.length === 1 && names[0] === namespaceName) {
        return namespaceName;
      }
    }
  }
  return null;
}

function findSourceFileRelative(
  sourceFiles: readonly ts.SourceFile[],
  relFromSrc: string,
): ts.SourceFile | undefined {
  const normalizedWant = relFromSrc.replace(/\\/g, '/');
  return sourceFiles.find((f) => {
    const r = path.relative(SRC_DIR, f.fileName);
    return r === relFromSrc || r.replace(/\\/g, '/') === normalizedWant;
  });
}

function loadDocGenerationProgram(): {
  program: ts.Program;
  sourceFiles: ts.SourceFile[];
} {
  const configPath = ts.findConfigFile(
    process.cwd(),
    ts.sys.fileExists,
    'tsconfig.json',
  );
  if (!configPath) {
    console.error('tsconfig.json not found');
    process.exit(1);
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
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
    if (full.endsWith('.test.ts')) return false;
    if (full.includes('node_modules')) return false;
    return full.startsWith(SRC_DIR);
  });

  return { program, sourceFiles };
}

function prepareApiDocsDirectories(): void {
  if (!fs.existsSync(API_DOCS_BASE)) {
    fs.mkdirSync(API_DOCS_BASE, { recursive: true });
  }
  // Для types — одна страница docs/api/types/index.md; очищаем старые поддиректории.
  const typesDocsDir = path.join(API_DOCS_BASE, 'types');
  if (fs.existsSync(typesDocsDir)) {
    fs.rmSync(typesDocsDir, { recursive: true });
  }
}

function createCollectBarrelExports(
  program: ts.Program,
  sourceFiles: readonly ts.SourceFile[],
): (dirName: string) => ExportDoc[] {
  return (dirName: string) => {
    const result: ExportDoc[] = [];
    for (const sf of sourceFiles) {
      const rel = path.relative(SRC_DIR, sf.fileName).replace(/\\/g, '/');
      if (!rel.startsWith(`${dirName}/`)) continue;
      const base = path.basename(rel);
      if (
        base === 'index.ts' ||
        base === '_exports.ts' ||
        base.endsWith('.test.ts')
      )
        continue;
      result.push(...collectExports(sf, program));
    }
    return result;
  };
}

type DocGenLoopState = {
  generatedGroups: { path: string; displayName: string }[];
  barrelDirs: Set<string>;
};

function shouldSkipBarrelExportsFile(
  baseName: string,
  dirName: string,
  sourceFiles: readonly ts.SourceFile[],
): boolean {
  if (baseName !== '_exports' || dirName === '') return false;
  const indexRel = path.join(dirName, 'index.ts');
  const indexFile = findSourceFileRelative(sourceFiles, indexRel);
  return Boolean(indexFile && detectBarrelNamespace(indexFile));
}

/** true — обработали barrel index и нужно перейти к следующему файлу */
function tryHandleBarrelIndexFile(
  sourceFile: ts.SourceFile,
  dirName: string,
  program: ts.Program,
  sourceFiles: readonly ts.SourceFile[],
  state: DocGenLoopState,
  collectBarrelExports: (dirName: string) => ExportDoc[],
): boolean {
  const namespaceName = detectBarrelNamespace(sourceFile);
  if (!namespaceName) return false;

  const exportsRel = path.join(dirName, '_exports.ts');
  const exportsFile = findSourceFileRelative(sourceFiles, exportsRel);
  if (!exportsFile) return false;

  let exportDocs = collectExports(exportsFile, program);
  if (exportDocs.length === 0) {
    exportDocs = collectBarrelExports(dirName);
  }
  if (exportDocs.length === 0) return true;

  const docDir = path.join(API_DOCS_BASE, namespaceName);
  fs.mkdirSync(docDir, { recursive: true });
  const md = generateGroupMarkdown(exportsFile.fileName, exportDocs, {
    namespacePrefix: `${namespaceName}.`,
    pageTitle: namespaceName,
  });
  fs.writeFileSync(path.join(docDir, 'index.md'), md, 'utf-8');
  const exportsDocDir = path.join(API_DOCS_BASE, dirName, '_exports');
  if (fs.existsSync(exportsDocDir)) {
    fs.rmSync(exportsDocDir, { recursive: true });
  }
  state.barrelDirs.add(dirName);
  state.generatedGroups.push({
    path: `/api/${namespaceName}`,
    displayName: namespaceName,
  });
  return true;
}

function pushSidebarEntriesForExports(
  groupPath: string,
  exportDocs: ExportDoc[],
  state: DocGenLoopState,
): void {
  for (const doc of exportDocs) {
    const exportGroupPath = path.join(API_DOCS_BASE, groupPath, doc.name);
    const exportIndexPath = path.join(exportGroupPath, 'index.md');
    fs.mkdirSync(exportGroupPath, { recursive: true });
    const exportMd = generateExportPageMarkdown(doc);
    fs.writeFileSync(exportIndexPath, exportMd, 'utf-8');

    const basePathApi = `/api/${groupPath}/${doc.name}`;
    const isTypeLike =
      doc.kind === 'type' || doc.kind === 'interface' || doc.kind === 'enum';
    const pathApi = isTypeLike ? `${basePathApi}#type` : basePathApi;
    state.generatedGroups.push({ path: pathApi, displayName: doc.name });
  }
}

function emitRegularModuleDocsAndSidebar(
  sourceFile: ts.SourceFile,
  groupPath: string,
  dirName: string,
  baseName: string,
  topDir: string,
  exportDocs: ExportDoc[],
  state: DocGenLoopState,
): void {
  const dir = path.join(API_DOCS_BASE, groupPath);
  const indexPath = path.join(dir, 'index.md');
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  const md = generateGroupMarkdown(sourceFile.fileName, exportDocs);
  fs.writeFileSync(indexPath, md, 'utf-8');

  if (dirName !== '' && state.barrelDirs.has(dirName)) return;

  if (topDir === 'react') {
    const nameFromFile = baseName.replace(/-([a-z])/gi, (_, c) =>
      c.toUpperCase(),
    );
    const displayName =
      exportDocs.find((e) => e.name === nameFromFile)?.name ??
      exportDocs[0].name;
    state.generatedGroups.push({
      path: `/api/${groupPath}`,
      displayName,
    });
    return;
  }

  if (groupPath === 'types') {
    state.generatedGroups.push({
      path: '/api/types/index#type',
      displayName: 'types',
    });
    return;
  }

  pushSidebarEntriesForExports(groupPath, exportDocs, state);
}

function writeSidebarJson(
  generatedGroups: { path: string; displayName: string }[],
): void {
  const sidebarNested = buildSidebarTree(generatedGroups);
  const sidebarMetaPath = path.join(API_DOCS_BASE, '_sidebar.json');
  fs.writeFileSync(
    sidebarMetaPath,
    JSON.stringify(sidebarNested, null, 2),
    'utf-8',
  );
}

function main() {
  const { program, sourceFiles } = loadDocGenerationProgram();
  prepareApiDocsDirectories();

  const state: DocGenLoopState = {
    generatedGroups: [],
    barrelDirs: new Set(),
  };
  const collectBarrelExports = createCollectBarrelExports(program, sourceFiles);

  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(SRC_DIR, sourceFile.fileName);
    if (relativePath.startsWith('..')) continue;

    const groupPath = relativePath.replace(/\.tsx?$/, '');
    const dirName = path.dirname(groupPath);
    const baseName = path.basename(groupPath);

    if (shouldSkipBarrelExportsFile(baseName, dirName, sourceFiles)) {
      continue;
    }

    if (baseName === 'index' && dirName !== '') {
      if (
        tryHandleBarrelIndexFile(
          sourceFile,
          dirName,
          program,
          sourceFiles,
          state,
          collectBarrelExports,
        )
      ) {
        continue;
      }
    }

    const exportDocs = collectExports(sourceFile, program);
    if (exportDocs.length === 0) continue;

    const topDir = groupPath.split('/')[0];
    emitRegularModuleDocsAndSidebar(
      sourceFile,
      groupPath,
      dirName,
      baseName,
      topDir,
      exportDocs,
      state,
    );
  }

  writeSidebarJson(state.generatedGroups);
  console.log(
    `Generated API docs for ${state.generatedGroups.length} modules in ${API_DOCS_BASE}`,
  );
}

main();
