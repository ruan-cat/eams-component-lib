# Component Library Showcase Repo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前仓库收敛成一个只服务于 `@eams-monorepo/vue-element-cui`、`@eams-monorepo/vue-element-cui-nuxt` 与 `old/vue-element-cui` 的现代组件库展示仓，并彻底切断旧云效远程与业务应用包。

**Architecture:** 先处理 Git 元数据风险，再删除业务内容，然后把 `eams-frontend-monorepo/` 的保留内容释放到 Git 根目录，最后收敛 workspace 配置、hooks、README 和 AI 记忆文件。由于本次改造会直接重命名当前分支并删除本地分支，不适合额外创建第二个 worktree；执行时应在当前主工作区完成，并在每个任务结束后做显式验证。

**Tech Stack:** Git, PowerShell, pnpm workspace, Turbo, Changesets, ESLint, Prettier, simple-git-hooks, commitlint, Vue 3, Nuxt 3, Vitest

---

## File Map

### Delete

- `documents/**`
- `eams-frontend-monorepo/apps/eams-frontend/**`
- `eams-frontend-monorepo/apps/eams-fronttea/**`
- `eams-frontend-monorepo/apps/eams-frontstu/**`

### Move From `eams-frontend-monorepo/` To Repo Root

- Directories: `.agent/`, `.changeset/`, `.claude/`, `.codex/`, `.cursor/`, `.vscode/`, `configs/`, `docs/plans/`, `docs/prompts/`, `docs/reports/`, `docs/superpowers/plans/`, `old/`, `openspec/`, `packages/`, `patches/`, `scripts/`
- Files: `.czrc`, `.editorconfig`, `.npmrc`, `.prettierignore`, `AGENTS.md`, `CLAUDE.md`, `commitlint.config.cjs`, `eslint.config.js`, `GEMINI.md`, `lint-staged.config.js`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `prettier.config.mjs`, `simple-git-hooks.mjs`, `taze.config.ts`, `tsconfig.base.json`, `tsconfig.json`, `turbo.json`

### Rewrite After Flattening

- `README.md`
- `.gitignore`
- `package.json`
- `pnpm-workspace.yaml`
- `prettier.config.mjs`
- `simple-git-hooks.mjs`
- `packages/vue-element-cui/README.md`
- `packages/vue-element-cui-nuxt/README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `pnpm-lock.yaml`

### Keep Intentionally

- `.gitattributes`
- `lint-staged.config.js`
- `old/vue-element-cui/**`
- `packages/vue-element-cui/**`
- `packages/vue-element-cui-nuxt/**`
- `docs/superpowers/specs/2026-04-09-component-library-showcase-repo-design.md`

### Final Shape

- Repo root is the only `pnpm workspace` root.
- `eams-frontend-monorepo/` no longer exists.
- `documents/` no longer exists.
- `apps/` no longer exists.
- Local Git retains only `main`.
- `git remote -v` prints nothing.

### Task 1: Isolate Git Metadata Before Any File Changes

**Files:**
- Modify: Git metadata only (`.git/config`, local refs)
- Verify: local refs and upstream state

- [ ] **Step 1: Capture the exact preflight state**

Run:

```powershell
git status --short --branch
git branch --format '%(refname:short)'
git remote -v
```

Expected:

```log
## f1...origin/f1 [ahead 1]
f1
master
origin  https://codeup.aliyun.com/zero-one-star/zero-awei/zero-one-eams2603.git (fetch)
origin  https://codeup.aliyun.com/zero-one-star/zero-awei/zero-one-eams2603.git (push)
```

- [ ] **Step 2: Remove the old cloud remote first**

Run:

```powershell
git remote remove origin
```

Expected:

```log
No output.
```

- [ ] **Step 3: Rename `f1` to `main`**

Run:

```powershell
git branch -m f1 main
```

Expected:

```log
No output.
```

- [ ] **Step 4: Delete the remaining local business branch**

Run:

```powershell
git branch -D master
```

Expected:

```log
Deleted branch master (was <sha>).
```

- [ ] **Step 5: Verify the repo is now single-branch and remote-free**

Run:

```powershell
git remote -v
git branch --format '%(refname:short)'
git status --short --branch
```

Expected:

```log
main
## main
```

- [ ] **Step 6: Do not create a commit for this task**

Reason:

```log
This task only mutates local Git metadata. There are no tracked-file changes to commit yet.
```

### Task 2: Remove Business Documents and Business Apps

**Files:**
- Delete: `documents/**`
- Delete: `eams-frontend-monorepo/apps/eams-frontend/**`
- Delete: `eams-frontend-monorepo/apps/eams-fronttea/**`
- Delete: `eams-frontend-monorepo/apps/eams-frontstu/**`

- [ ] **Step 1: Confirm the deletion targets still exist**

Run:

```powershell
Get-ChildItem -Force -Name '.\documents'
Get-ChildItem -Force -Name '.\eams-frontend-monorepo\apps'
```

Expected:

```log
documents/ contains business docs
apps/ contains eams-frontend, eams-fronttea, eams-frontstu
```

- [ ] **Step 2: Remove the tracked business content in one Git operation**

Run:

```powershell
git rm -r -- documents eams-frontend-monorepo/apps/eams-frontend eams-frontend-monorepo/apps/eams-fronttea eams-frontend-monorepo/apps/eams-frontstu
```

Expected:

```log
rm 'documents/...'
rm 'eams-frontend-monorepo/apps/eams-frontend/...'
rm 'eams-frontend-monorepo/apps/eams-fronttea/...'
rm 'eams-frontend-monorepo/apps/eams-frontstu/...'
```

- [ ] **Step 3: Verify the directories are gone from the working tree**

Run:

```powershell
Test-Path '.\documents'
Test-Path '.\eams-frontend-monorepo\apps'
```

Expected:

```log
False
False
```

- [ ] **Step 4: Inspect the staged deletion set before committing**

Run:

```powershell
git status --short
```

Expected:

```log
D  documents/...
D  eams-frontend-monorepo/apps/eams-frontend/...
D  eams-frontend-monorepo/apps/eams-fronttea/...
D  eams-frontend-monorepo/apps/eams-frontstu/...
```

- [ ] **Step 5: Commit the business-content removal**

Run:

```powershell
git commit -m "chore(repo)!: remove business apps and documents"
```

Expected:

```log
[main <sha>] chore(repo)!: remove business apps and documents
```

### Task 3: Flatten `eams-frontend-monorepo/` Into The Git Root

**Files:**
- Move: `eams-frontend-monorepo/.agent -> .agent`
- Move: `eams-frontend-monorepo/.changeset -> .changeset`
- Move: `eams-frontend-monorepo/.claude -> .claude`
- Move: `eams-frontend-monorepo/.codex -> .codex`
- Move: `eams-frontend-monorepo/.cursor -> .cursor`
- Move: `eams-frontend-monorepo/.vscode -> .vscode`
- Move: `eams-frontend-monorepo/configs -> configs`
- Move: `eams-frontend-monorepo/docs/plans -> docs/plans`
- Move: `eams-frontend-monorepo/docs/prompts -> docs/prompts`
- Move: `eams-frontend-monorepo/docs/reports -> docs/reports`
- Move: `eams-frontend-monorepo/docs/superpowers/plans/* -> docs/superpowers/plans/*`
- Move: `eams-frontend-monorepo/old -> old`
- Move: `eams-frontend-monorepo/openspec -> openspec`
- Move: `eams-frontend-monorepo/packages -> packages`
- Move: `eams-frontend-monorepo/patches -> patches`
- Move: `eams-frontend-monorepo/scripts -> scripts`
- Move: `eams-frontend-monorepo/.czrc -> .czrc`
- Move: `eams-frontend-monorepo/.editorconfig -> .editorconfig`
- Move: `eams-frontend-monorepo/.npmrc -> .npmrc`
- Move: `eams-frontend-monorepo/.prettierignore -> .prettierignore`
- Move: `eams-frontend-monorepo/AGENTS.md -> AGENTS.md`
- Move: `eams-frontend-monorepo/CLAUDE.md -> CLAUDE.md`
- Move: `eams-frontend-monorepo/commitlint.config.cjs -> commitlint.config.cjs`
- Move: `eams-frontend-monorepo/eslint.config.js -> eslint.config.js`
- Move: `eams-frontend-monorepo/GEMINI.md -> GEMINI.md`
- Move: `eams-frontend-monorepo/lint-staged.config.js -> lint-staged.config.js`
- Move: `eams-frontend-monorepo/package.json -> package.json`
- Move: `eams-frontend-monorepo/pnpm-lock.yaml -> pnpm-lock.yaml`
- Move: `eams-frontend-monorepo/pnpm-workspace.yaml -> pnpm-workspace.yaml`
- Move: `eams-frontend-monorepo/prettier.config.mjs -> prettier.config.mjs`
- Move: `eams-frontend-monorepo/simple-git-hooks.mjs -> simple-git-hooks.mjs`
- Move: `eams-frontend-monorepo/taze.config.ts -> taze.config.ts`
- Move: `eams-frontend-monorepo/tsconfig.base.json -> tsconfig.base.json`
- Move: `eams-frontend-monorepo/tsconfig.json -> tsconfig.json`
- Move: `eams-frontend-monorepo/turbo.json -> turbo.json`
- Delete: `eams-frontend-monorepo/.gitignore`
- Delete: `eams-frontend-monorepo/README.md`
- Delete: `eams-frontend-monorepo/`

- [ ] **Step 1: Move the hidden directories and source directories in short commands**

Run:

```powershell
git mv .\eams-frontend-monorepo\.agent .\
git mv .\eams-frontend-monorepo\.changeset .\
git mv .\eams-frontend-monorepo\.claude .\
git mv .\eams-frontend-monorepo\.codex .\
git mv .\eams-frontend-monorepo\.cursor .\
git mv .\eams-frontend-monorepo\.vscode .\
```

Run:

```powershell
git mv .\eams-frontend-monorepo\configs .\
git mv .\eams-frontend-monorepo\old .\
git mv .\eams-frontend-monorepo\openspec .\
git mv .\eams-frontend-monorepo\packages .\
git mv .\eams-frontend-monorepo\patches .\
git mv .\eams-frontend-monorepo\scripts .\
```

Expected:

```log
No output.
```

- [ ] **Step 2: Move the flat config files and manifests to repo root**

Run:

```powershell
git mv .\eams-frontend-monorepo\.czrc .\
git mv .\eams-frontend-monorepo\.editorconfig .\
git mv .\eams-frontend-monorepo\.npmrc .\
git mv .\eams-frontend-monorepo\.prettierignore .\
git mv .\eams-frontend-monorepo\AGENTS.md .\
git mv .\eams-frontend-monorepo\CLAUDE.md .\
git mv .\eams-frontend-monorepo\commitlint.config.cjs .\
git mv .\eams-frontend-monorepo\eslint.config.js .\
```

Run:

```powershell
git mv .\eams-frontend-monorepo\GEMINI.md .\
git mv .\eams-frontend-monorepo\lint-staged.config.js .\
git mv .\eams-frontend-monorepo\package.json .\
git mv .\eams-frontend-monorepo\pnpm-lock.yaml .\
git mv .\eams-frontend-monorepo\pnpm-workspace.yaml .\
git mv .\eams-frontend-monorepo\prettier.config.mjs .\
git mv .\eams-frontend-monorepo\simple-git-hooks.mjs .\
```

Run:

```powershell
git mv .\eams-frontend-monorepo\taze.config.ts .\
git mv .\eams-frontend-monorepo\tsconfig.base.json .\
git mv .\eams-frontend-monorepo\tsconfig.json .\
git mv .\eams-frontend-monorepo\turbo.json .\
```

Expected:

```log
No output.
```

- [ ] **Step 3: Merge the retained docs into the existing root `docs/` tree**

Run:

```powershell
git mv .\eams-frontend-monorepo\docs\plans .\docs\
git mv .\eams-frontend-monorepo\docs\prompts .\docs\
git mv .\eams-frontend-monorepo\docs\reports .\docs\
```

Run:

```powershell
Get-ChildItem -Force '.\eams-frontend-monorepo\docs\superpowers\plans' | ForEach-Object {
	git mv $_.FullName '.\docs\superpowers\plans\'
}
```

Expected:

```log
No output.
```

- [ ] **Step 4: Remove the leftover nested README and nested `.gitignore`**

Run:

```powershell
git rm -- .\eams-frontend-monorepo\README.md .\eams-frontend-monorepo\.gitignore
```

Expected:

```log
rm 'eams-frontend-monorepo/README.md'
rm 'eams-frontend-monorepo/.gitignore'
```

- [ ] **Step 5: Remove the now-empty `eams-frontend-monorepo/` directory**

Run:

```powershell
Remove-Item -LiteralPath '.\eams-frontend-monorepo' -Force -Recurse
```

Expected:

```log
No output.
```

- [ ] **Step 6: Verify the flattening result**

Run:

```powershell
Test-Path '.\eams-frontend-monorepo'
Get-ChildItem -Force -Name '.'
```

Expected:

```log
False
.agent
.changeset
.claude
.codex
.cursor
.vscode
configs
docs
old
openspec
packages
patches
scripts
.czrc
.editorconfig
.npmrc
.prettierignore
AGENTS.md
CLAUDE.md
GEMINI.md
commitlint.config.cjs
eslint.config.js
lint-staged.config.js
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
prettier.config.mjs
simple-git-hooks.mjs
tsconfig.base.json
tsconfig.json
turbo.json
README.md
.gitignore
```

- [ ] **Step 7: Commit the structural flattening**

Run:

```powershell
git commit -m "refactor(repo)!: flatten monorepo to repository root"
```

Expected:

```log
[main <sha>] refactor(repo)!: flatten monorepo to repository root
```

### Task 4: Prune Root Workspace Manifests and Lockfile

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Replace `package.json` with the pruned root manifest**

Replace the file with:

```json
{
	"name": "@eams-monorepo/root",
	"description": "Modern component library showcase monorepo",
	"private": true,
	"version": "1.0.0",
	"type": "module",
	"packageManager": "pnpm@10.32.1",
	"engines": {
		"node": ">=20.19.0 || >=22.12.0 || >=24.0.0"
	},
	"scripts": {
		"up-taze": "pnpm -w up @ruan-cat/taze-config -L && npx taze -r",
		"preinstall": "npx only-allow pnpm",
		"postinstall": "simple-git-hooks",
		"build": "turbo build",
		"dev": "turbo dev",
		"lint": "eslint .",
		"format": "prettier --experimental-cli --write .",
		"format:check": "prettier --check '**/*.{js,jsx,ts,tsx,mts,json,css,scss,md,yml,yaml,html,vue}' --ignore-path .gitignore",
		"clean": "rimraf -g '**/{dist,.turbo,.cache,.temp}' --glob",
		"clean:deps": "rimraf -g '**/node_modules' --glob",
		"commit": "git-cz",
		"changeset:add": "changeset add",
		"changeset:version": "changeset version",
		"changeset:publish": "changeset publish",
		"release": "pnpm build && changeset publish"
	},
	"devDependencies": {
		"@changesets/cli": "^2.30.0",
		"@commitlint/cli": "^19.8.1",
		"@commitlint/config-conventional": "^19.8.1",
		"@prettier/plugin-oxc": "^0.1.3",
		"@ruan-cat/commitlint-config": "^4.9.4",
		"@ruan-cat/taze-config": "^1.0.4",
		"commitizen": "^4.3.1",
		"cz-git": "^1.12.0",
		"eslint": "^9.39.4",
		"lint-staged": "^15.5.2",
		"prettier": "^3.8.1",
		"prettier-plugin-lint-md": "^1.0.1",
		"rimraf": "^6.1.3",
		"simple-git-hooks": "^2.13.1",
		"taze": "^19.10.0",
		"turbo": "^2.8.17",
		"typescript": "^5.9.3"
	},
	"dependencies": {
		"@eams-monorepo/vue-element-cui": "workspace:^",
		"@eams-monorepo/vue-element-cui-nuxt": "workspace:^"
	},
	"pnpm": {
		"patchedDependencies": {
			"wot-design-uni@1.14.0": "patches/wot-design-uni@1.14.0.patch"
		}
	}
}
```

Expected:

```log
`package.json` no longer contains any `git:*` scripts or app-only dependencies.
```

- [ ] **Step 2: Rewrite `pnpm-workspace.yaml` without `apps/*`**

Replace the file with:

```yaml
packages:
  - old/*
  - packages/*
  - configs/*

overrides:
  unconfig: "7.3.2"
  sass: "^1.98.0"
  "@intlify/core-base": "11.3.0"
  "@intlify/shared": "11.3.0"

onlyBuiltDependencies:
  - "@carbon/icons"
  - "@parcel/watcher"
  - core-js
  - core-js-pure
  - ejs
  - es5-ext
  - esbuild
  - sharp
  - simple-git-hooks
  - vue-demi
  - yorkie
```

Expected:

```log
`pnpm-workspace.yaml` contains only `old/*`, `packages/*`, and `configs/*`.
```

- [ ] **Step 3: Verify no app-only manifest references remain**

Run:

```powershell
rg -n "@eams-monorepo/(admin|stu-app|tea-app)|camunda-bpmn-moddle|vite-svg-loader|vue-i18n|@unocss/preset-legacy-compat|^  - apps/|@uni-helper/unocss-preset-uni" package.json pnpm-workspace.yaml
```

Expected:

```log
No matches.
```

- [ ] **Step 4: Refresh the lockfile from the new root workspace**

Run:

```powershell
pnpm install
```

Expected:

```log
Lockfile is updated from repo root and no package from deleted apps is reintroduced.
```

- [ ] **Step 5: Review the manifest and lockfile diff**

Run:

```powershell
git diff -- package.json pnpm-workspace.yaml pnpm-lock.yaml
```

Expected:

```log
Diff shows only removal of business-app references and path relocation fallout.
```

- [ ] **Step 6: Commit the workspace pruning**

Run:

```powershell
git commit -m "chore(workspace): prune business-only workspace dependencies"
```

Expected:

```log
[main <sha>] chore(workspace): prune business-only workspace dependencies
```

### Task 5: Normalize Root Hooks, Ignore Rules, and EOL Policy

**Files:**
- Modify: `.gitignore`
- Modify: `simple-git-hooks.mjs`
- Modify: `prettier.config.mjs`
- Verify: `.editorconfig`
- Verify: `.gitattributes`
- Verify unchanged content: `lint-staged.config.js`

- [ ] **Step 1: Replace the root `.gitignore` with the modern frontend monorepo ignore list**

Replace the file with:

```gitignore
# Dependencies
node_modules
.pnpm-store

# Build output
dist
.output
*.tsbuildinfo

# Turbo
.turbo

# Cache
.cache
.temp
.eslintcache

# Test coverage
coverage
.nyc_output

# Environment
!.env
.env.local
.env.*.local

# IDE
.idea

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Source maps
*.map
*.js.map
*.css.map
*.d.ts.map

# Lock files (only keep pnpm-lock.yaml)
package-lock.json
yarn.lock

# Local AI collaboration artifacts
.superpowers/

# Local cache
local_cache

# Vite cache
.vite
.worktrees/
!patches/
!patches/*.patch
```

Expected:

```log
The root `.gitignore` no longer contains Java/C++/documents-era ignore rules.
```

- [ ] **Step 2: Rewrite `simple-git-hooks.mjs` to the root-level simple mode**

Replace the file with:

```js
export default {
	"commit-msg": "npx --no-install commitlint --edit ${1}",
	"pre-commit": "npx lint-staged",
};
```

Expected:

```log
The file no longer contains `cd eams-frontend-monorepo` or `ROOT=$(pwd)`.
```

- [ ] **Step 3: Lock Prettier to LF without changing any other behavior**

Apply this patch:

```diff
--- a/prettier.config.mjs
+++ b/prettier.config.mjs
@@
-	endOfLine: "auto",
+	endOfLine: "lf",
```

Expected:

```log
`prettier.config.mjs` now enforces LF.
```

- [ ] **Step 4: Explicitly preserve `lint-staged.config.js` and verify LF guardrails**

Run:

```powershell
rg -n "prettierExtensions|pnpm-lock.yaml" lint-staged.config.js
rg -n "end_of_line = lf" .editorconfig
rg -n "\\* text=auto eol=lf" .gitattributes
```

Expected:

```log
lint-staged config is still the fine-grained extension-filter version
.editorconfig still declares LF
.gitattributes still declares LF normalization
```

- [ ] **Step 5: Reinstall hooks from the new root and renormalize tracked files**

Run:

```powershell
pnpm exec simple-git-hooks
git add --renormalize .
```

Expected:

```log
Hooks are installed against the root package and Git refreshes LF-normalized index entries.
```

- [ ] **Step 6: Review the tooling-only diff**

Run:

```powershell
git diff -- .gitignore simple-git-hooks.mjs prettier.config.mjs .editorconfig .gitattributes lint-staged.config.js
```

Expected:

```log
`lint-staged.config.js` has no content change, while the other files only show the intended root-tooling cleanup.
```

- [ ] **Step 7: Commit the tooling cleanup**

Run:

```powershell
git commit -m "chore(tooling): normalize root hooks and formatting rules"
```

Expected:

```log
[main <sha>] chore(tooling): normalize root hooks and formatting rules
```

### Task 6: Rewrite The Public Narrative and AI Memory Files

**Files:**
- Modify: `README.md`
- Modify: `packages/vue-element-cui/README.md`
- Modify: `packages/vue-element-cui-nuxt/README.md`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `GEMINI.md`

- [ ] **Step 1: Rewrite the repo root `README.md` as a showcase-repo overview**

Replace the file with:

```md
# `eams-component-lib`

一个面向开源展示与求职叙事的现代组件库 monorepo。

## 仓库定位

这个仓库不再承载具体业务应用，而是专注于三件事：

- `packages/vue-element-cui`：现代组件库本体
- `packages/vue-element-cui-nuxt`：组件库展示与文档站
- `old/vue-element-cui`：旧版 Vue 2 组件库迁移对照

## 工程化能力

- `pnpm workspace` 管理多包
- `Turbo` 统一构建与开发任务
- `Changesets` 维护发版链路
- `ESLint`、`Prettier`、`simple-git-hooks`、`lint-staged` 收敛代码质量
- `Vitest` 维护组件库测试基线

## 目录结构

```plain
eams-component-lib/
├─ packages/
│  ├─ vue-element-cui/
│  └─ vue-element-cui-nuxt/
├─ old/
│  └─ vue-element-cui/
├─ docs/
├─ openspec/
├─ scripts/
└─ configs/
```

## 快速开始

```bash
pnpm install
pnpm lint
pnpm build
pnpm --filter @eams-monorepo/vue-element-cui test
pnpm --filter @eams-monorepo/vue-element-cui-nuxt dev
```

## 迁移叙事

仓库保留了 `old/vue-element-cui`，用于展示旧组件库向现代 monorepo、文档站、测试链路和发版流程迁移的完整轨迹。这部分内容是对外叙事的一部分，不参与当前主链路开发。

## License

MIT
```

Expected:

```log
The root README no longer mentions teaching-management business apps or `documents/`.
```

- [ ] **Step 2: Rewrite `packages/vue-element-cui/README.md` as a standalone component-library README**

Replace the file with:

```md
# @eams-monorepo/vue-element-cui

基于 Element Plus 的现代 Vue 3 组件库。

> 当前仓库只围绕组件库本体、组件库文档站和历史迁移对照展开，不再绑定任何业务应用。
> 演示与文档请查看 `packages/vue-element-cui-nuxt`。

## 安装

```bash
pnpm add @eams-monorepo/vue-element-cui element-plus
```

## 全量注册

```ts
import { createApp } from "vue";
import VueElementCui from "@eams-monorepo/vue-element-cui";
import "@eams-monorepo/vue-element-cui/styles";

const app = createApp(App);
app.use(VueElementCui);
```

## 按需接入

```ts
import Components from "unplugin-vue-components/vite";
import { VueElementCuiResolver } from "@eams-monorepo/vue-element-cui/resolver";

Components({
	resolvers: [VueElementCuiResolver()],
});
```

## 自动导入

```ts
import AutoImport from "unplugin-auto-import/vite";
import {
	VueElementCuiAutoImportResolver,
	vueElementCuiImports,
	vueElementCuiTypeImports,
} from "@eams-monorepo/vue-element-cui/resolver";

AutoImport({
	resolvers: [VueElementCuiAutoImportResolver()],
	imports: [vueElementCuiImports, ...vueElementCuiTypeImports],
});
```

## 本地开发

```bash
pnpm --filter @eams-monorepo/vue-element-cui build
pnpm --filter @eams-monorepo/vue-element-cui dev
pnpm --filter @eams-monorepo/vue-element-cui test
pnpm --filter @eams-monorepo/vue-element-cui typecheck
```

## License

MIT
```

Expected:

```log
The component README no longer says it mainly serves `apps/eams-frontend`.
```

- [ ] **Step 3: Rewrite `packages/vue-element-cui-nuxt/README.md` as the showcase-site README**

Replace the file with:

```md
# @eams-monorepo/vue-element-cui-nuxt

`@eams-monorepo/vue-element-cui` 的展示站与文档站，基于 Nuxt 3 与 `shadcn-docs-nuxt`。

## 作用

- 展示组件库示例、布局和交互效果
- 承载组件文档与接入说明
- 为求职展示提供完整的工程化演示入口

## 本地开发

```bash
pnpm --filter @eams-monorepo/vue-element-cui-nuxt dev
pnpm --filter @eams-monorepo/vue-element-cui-nuxt build
pnpm --filter @eams-monorepo/vue-element-cui-nuxt generate
pnpm --filter @eams-monorepo/vue-element-cui-nuxt preview
```

## 测试

```bash
pnpm --filter @eams-monorepo/vue-element-cui-nuxt test
pnpm --filter @eams-monorepo/vue-element-cui-nuxt test:watch
```

## 文档维护

- 组件文档位于 `packages/vue-element-cui-nuxt/content/`
- 页面模板位于 `packages/vue-element-cui-nuxt/pages/`
- 展示组件位于 `packages/vue-element-cui-nuxt/components/`

## 访问地址

- 开发环境：`http://localhost:3000`
- 文档首页：`http://localhost:3000/docs/getting-started`
```

Expected:

```log
The docs-site README now describes a showcase site instead of a generic monorepo-sidecar package.
```

- [ ] **Step 4: Patch the top sections of `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`**

In each file, apply these two exact edits.

First, replace the title and intro paragraph:

```diff
--- a/AGENTS.md
+++ b/AGENTS.md
@@
-# EAMS 前端单仓架构项目
+# 现代组件库展示仓
@@
-本项目是 EAMS（企业资产管理系统）的前端单仓架构项目。
+本项目是一个面向开源展示与求职叙事的前端组件库 monorepo。
```

Second, replace the bullet list under `### 2.1. 全局术语` with:

```md
- `组件库`：即 `packages\vue-element-cui\package.json` 指代的现代 Vue 3 组件库。
- `组件库文档站`：即 `packages\vue-element-cui-nuxt\package.json` 指代的展示与文档站。
- `旧组件库`：即 `old\vue-element-cui\package.json` 指代的 Vue 2 历史实现，仅作为迁移对照，不参与当前主链路开发。
- `仓库根`：当前 Git 根目录，同时也是唯一的 `pnpm workspace` 根目录；项目中不再存在 `eams-frontend-monorepo/` 这一层额外目录。
```

Expected:

```log
The memory files stop referring to `apps/eams-frontend`, `apps/eams-fronttea`, and `apps/eams-frontstu`.
```

- [ ] **Step 5: Search for stale public-facing business references**

Run:

```powershell
rg -n "教务|apps/eams-frontend|apps/eams-fronttea|apps/eams-frontstu|documents/" README.md packages/vue-element-cui/README.md packages/vue-element-cui-nuxt/README.md AGENTS.md CLAUDE.md GEMINI.md
```

Expected:

```log
No matches.
```

- [ ] **Step 6: Commit the narrative rewrite**

Run:

```powershell
git commit -m "docs(repo): rewrite component library showcase narrative"
```

Expected:

```log
[main <sha>] docs(repo): rewrite component library showcase narrative
```

### Task 7: Verify Structure, Tooling, and Build Health

**Files:**
- Verify only: working tree, build outputs, package scripts

- [ ] **Step 1: Verify the final structure constraints**

Run:

```powershell
Test-Path '.\documents'
Test-Path '.\eams-frontend-monorepo'
Test-Path '.\apps'
Test-Path '.\packages\vue-element-cui'
Test-Path '.\packages\vue-element-cui-nuxt'
Test-Path '.\old\vue-element-cui'
```

Expected:

```log
False
False
False
True
True
True
```

- [ ] **Step 2: Verify Git state is still correct after all commits**

Run:

```powershell
git remote -v
git branch --format '%(refname:short)'
git status --short --branch
```

Expected:

```log
main
## main
```

- [ ] **Step 3: Run the repo-wide lint task from the flattened root**

Run:

```powershell
pnpm lint
```

Expected:

```log
ESLint completes from repo root without any path assumption that still points at `eams-frontend-monorepo/`.
```

- [ ] **Step 4: Run the repo-wide build**

Run:

```powershell
pnpm build
```

Expected:

```log
Turbo finishes successfully and only builds the retained workspace packages.
```

- [ ] **Step 5: Run the component-library test suite**

Run:

```powershell
pnpm --filter @eams-monorepo/vue-element-cui test
```

Expected:

```log
Vitest passes for the component library.
```

- [ ] **Step 6: Run the docs-site production build directly**

Run:

```powershell
pnpm --filter @eams-monorepo/vue-element-cui-nuxt build
```

Expected:

```log
The Nuxt docs site builds successfully from the flattened repo root.
```

- [ ] **Step 7: Confirm the working tree is clean after verification**

Run:

```powershell
git status --short
```

Expected:

```log
No output.
```

- [ ] **Step 8: Do not create an extra commit if verification is clean**

Reason:

```log
If `git status --short` is empty, stop here. Only create a follow-up commit when verification exposes a real fix.
```
