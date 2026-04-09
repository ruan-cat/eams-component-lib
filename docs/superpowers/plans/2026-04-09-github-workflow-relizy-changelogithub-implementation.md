# GitHub Workflow Relizy Changelogithub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为当前组件库展示仓落地 GitHub Actions CI、自检、Relizy 版本生成、根级 `CHANGELOG.md` 与 GitHub Release，同时保持“不发布 npm 包、保留历史 tag、只让未来 `v*` tag 生成 GitHub Release”。

**Architecture:** 发布链路分成两段：本地通过 `@ruan-cat/utils` 提供的 `relizy-runner` bin 生成版本计划、根级 `CHANGELOG.md`、release commit 与 `v*` tag；云端通过 `release.yml` 在 `v*` tag push 后调用 `changelogithub` 生成 GitHub Release。重要修正：严格遵守 `init-relizy` 技能，不创建本地 `scripts/relizy-runner.ts`；同时保持 `packages/vue-element-cui-nuxt` 的 `private: true` 不变，只纳入 CI 构建链，不纳入 relizy 的独立 bump 扫描。

**Tech Stack:** GitHub Actions, pnpm, Turbo, Relizy, Changelogen, Changelogithub, Prettier, `@ruan-cat/utils`, Vue 3, Nuxt 3, Vitest

---

## File Map

### Create

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `changelog.config.ts`
- `changelogithub.config.ts`
- `relizy.config.ts`
- `CHANGELOG.md`

### Modify

- `package.json`
- `pnpm-lock.yaml`
- `README.md`

### Verify Only

- `.changeset/config.json`
- `packages/vue-element-cui/package.json`
- `packages/vue-element-cui-nuxt/package.json`
- `old/vue-element-cui/package.json`

### Do Not Create

- `scripts/relizy-runner.ts`

Reason:

```log
`init-relizy` 技能明确要求使用 `@ruan-cat/utils` 的 `relizy-runner` bin，禁止在目标仓库内新建本地 runner 副本。
```

### Release Scope

- Relizy 管理：`packages/vue-element-cui`
- CI 自检覆盖：`packages/vue-element-cui`、`packages/vue-element-cui-nuxt`、根 `turbo build`
- 历史保留但不纳入新发版扫描：`old/vue-element-cui`

---

### Task 1: 对齐根级发版工具链与脚本入口

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: 先验证当前仓库还没有 relizy runner 能力**

Run:

```powershell
pnpm exec relizy-runner --help
```

Expected:

```log
ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL 或 command not found，说明当前根目录尚未接入 `relizy-runner`。
```

- [ ] **Step 2: 在 `package.json` 里补齐 CI / relizy / changelog 脚本与依赖**

Apply this patch:

```diff
--- a/package.json
+++ b/package.json
@@
 	"scripts": {
 		"up-taze": "pnpm -w up @ruan-cat/taze-config -L && npx taze -r",
 		"preinstall": "npx only-allow pnpm",
 		"postinstall": "simple-git-hooks",
 		"build": "turbo build",
 		"dev": "turbo dev",
+		"ci": "pnpm lint && pnpm build && pnpm --filter @eams-monorepo/vue-element-cui test && pnpm --filter @eams-monorepo/vue-element-cui-nuxt build",
 		"lint": "eslint .",
 		"format": "prettier --experimental-cli --write .",
 		"format:check": "prettier --check '**/*.{js,jsx,ts,tsx,mts,json,css,scss,md,yml,yaml,html,vue}' --ignore-path .gitignore",
+		"format:changelog": "pnpm exec prettier --experimental-cli --write CHANGELOG.md",
 		"clean": "rimraf -g '**/{dist,.turbo,.cache,.temp}' --glob",
 		"clean:deps": "rimraf -g '**/node_modules' --glob",
 		"commit": "git-cz",
 		"changeset:add": "changeset add",
 		"changeset:version": "changeset version",
 		"changeset:publish": "changeset publish",
-		"release": "pnpm build && changeset publish"
+		"release": "pnpm run release:relizy",
+		"release:relizy": "pnpm exec relizy-runner release --no-publish --no-provider-release --yes",
+		"release:relizy:dry-run": "pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes",
+		"release:changelog": "pnpm exec relizy-runner changelog --yes",
+		"release:changelog:dry-run": "pnpm exec relizy-runner changelog --dry-run --yes"
 	},
 	"devDependencies": {
 		"@changesets/cli": "^2.30.0",
 		"@commitlint/cli": "^19.8.1",
 		"@commitlint/config-conventional": "^19.8.1",
 		"@prettier/plugin-oxc": "^0.1.3",
 		"@ruan-cat/commitlint-config": "^4.9.4",
 		"@ruan-cat/taze-config": "^1.0.4",
+		"@ruan-cat/utils": "^4.22.0",
+		"changelogen": "^0.6.2",
+		"changelogithub": "^13.16.1",
 		"commitizen": "^4.3.1",
 		"cz-git": "^1.12.0",
 		"eslint": "^9.39.4",
 		"lint-staged": "^15.5.2",
 		"prettier": "^3.8.1",
 		"prettier-plugin-lint-md": "^1.0.1",
+		"relizy": "1.2.2-beta.0",
 		"rimraf": "^6.1.3",
 		"simple-git-hooks": "^2.13.1",
 		"taze": "^19.10.0",
 		"turbo": "^2.8.17",
```

Expected:

```log
`package.json` 里不再把 `changeset publish` 作为主发版入口，新增 CI、自检、relizy、changelog 相关脚本，并引入 relizy 工具链依赖。
```

- [ ] **Step 3: 安装依赖并刷新锁文件**

Run:

```powershell
pnpm install
```

Expected:

```log
Install 完成，`pnpm-lock.yaml` 更新，且没有重新引入任何业务应用依赖。
```

- [ ] **Step 4: 验证 `relizy-runner` bin 已经可用**

Run:

```powershell
pnpm exec relizy-runner --help
```

Expected:

```log
输出 `relizy-runner` 的帮助信息，不再报 command not found。
```

- [ ] **Step 5: 提交根级发版工具链变更**

Run:

```powershell
git add package.json pnpm-lock.yaml
git commit -m "build(release): add relizy toolchain and root scripts"
```

Expected:

```log
[main <sha>] build(release): add relizy toolchain and root scripts
```

---

### Task 2: 落地 changelog 与 relizy 配置文件

**Files:**

- Create: `changelog.config.ts`
- Create: `changelogithub.config.ts`
- Create: `relizy.config.ts`
- Create: `CHANGELOG.md`

- [ ] **Step 1: 先写入根级 changelog 配置**

Create `changelog.config.ts` with:

```ts
import type { ChangelogConfig } from "changelogen";
import { changelogogenUseTypes } from "@ruan-cat/commitlint-config";

const relizyCompatibleTypes = changelogogenUseTypes as NonNullable<
	Parameters<typeof import("relizy").defineConfig>[0]["types"]
>;

export default {
	output: "CHANGELOG.md",
	types: relizyCompatibleTypes,
	templates: {
		commitMessage: "📦 release: publish component library showcase v{{newVersion}}",
	},
} satisfies Partial<ChangelogConfig>;
```

Expected:

```log
根级 changelog 配置开始统一 commit type 映射与根级 CHANGELOG 输出路径。
```

- [ ] **Step 2: 写入只负责 GitHub Release 的 changelogithub 配置**

Create `changelogithub.config.ts` with:

```ts
import { defineConfig } from "changelogithub";

import changelogConfig from "./changelog.config.ts";

type ChangelogithubConfig = Parameters<typeof defineConfig>[0];
type ChangelogithubTypes = ChangelogithubConfig["types"];

const changelogithubTypes = (
	changelogConfig.types
		? Object.fromEntries(
				Object.entries(changelogConfig.types).filter(([, value]) => typeof value === "object" && value !== null),
			)
		: undefined
) as ChangelogithubTypes;

export default defineConfig({
	...changelogConfig,
	types: changelogithubTypes,
	output: false,
	capitalize: false,
});
```

Expected:

```log
GitHub Release 文案配置与本地 CHANGELOG 生成配置共享同一套类型映射，但不会回写 `CHANGELOG.md`。
```

- [ ] **Step 3: 写入 relizy 主配置，并把 bump 范围锁定在现代组件库包**

Create `relizy.config.ts` with:

```ts
import { defineConfig } from "relizy";

import changelogConfig from "./changelog.config.ts";

export default defineConfig({
	projectName: "eams-component-lib",

	types: changelogConfig.types,
	templates: {
		...(changelogConfig.templates ?? {}),
		changelogTitle: "{{newVersion}} ({{date}})",
	},

	monorepo: {
		versionMode: "independent",
		packages: ["packages/vue-element-cui"],
	},

	changelog: {
		rootChangelog: true,
		includeCommitBody: true,
		formatCmd: "pnpm run format:changelog",
	},

	release: {
		changelog: true,
		commit: true,
		push: true,
		gitTag: true,
		clean: true,
		noVerify: false,
		publish: false,
		providerRelease: false,
		social: false,
		prComment: false,
	},
});
```

Expected:

```log
Relizy 的独立版本扫描范围只包含 `packages/vue-element-cui`，不会把 `old/vue-element-cui` 拉进新的 bump 主链，也不会触发 npm publish。
```

- [ ] **Step 4: 建立根级 changelog 占位文件**

Create `CHANGELOG.md` with:

```md
# Changelog

All notable changes to this repository will be documented in this file.
```

Expected:

```log
仓库根目录开始具备稳定、可格式化、可提交的 changelog 文件入口。
```

- [ ] **Step 5: 跑 dry-run 验证 relizy 配置链**

Run:

```powershell
pnpm run release:changelog:dry-run
pnpm run release:relizy:dry-run
```

Expected:

```log
`release:changelog:dry-run` 能输出 changelog 预览；
`release:relizy:dry-run` 能输出 release 计划或 “No packages need to be bumped”；
输出中不应出现 npm publish 步骤，也不应出现 `@eams-monorepo/vue-element-cui-legacy`。
```

- [ ] **Step 6: 提交 changelog / relizy 配置**

Run:

```powershell
git add changelog.config.ts changelogithub.config.ts relizy.config.ts CHANGELOG.md
git commit -m "feat(release): configure relizy changelog and github release"
```

Expected:

```log
[main <sha>] feat(release): configure relizy changelog and github release
```

---

### Task 3: 编写 GitHub Actions 的 CI 与 Release 工作流

**Files:**

- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: 先写入 CI 自检 workflow**

Create `.github/workflows/ci.yml` with:

```yaml
name: CI

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main
  workflow_dispatch:

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.32.1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Print tool versions
        run: |
          node -v
          pnpm -v
          pnpm exec turbo --version

      - name: Login Turbo remote cache
        if: ${{ env.TURBO_TOKEN != '' && env.TURBO_TEAM != '' }}
        run: pnpm exec turbo login --token="${{ env.TURBO_TOKEN }}" --team="${{ env.TURBO_TEAM }}"

      - name: Link Turbo remote cache
        if: ${{ env.TURBO_TOKEN != '' && env.TURBO_TEAM != '' }}
        run: pnpm exec turbo link --token="${{ env.TURBO_TOKEN }}" --scope="${{ env.TURBO_TEAM }}" --yes

      - name: Run CI self-check
        run: pnpm run ci
```

Expected:

```log
CI workflow 只在 `main` 和 PR 上做自检；有 Turbo secrets 时启用远程缓存，没有 secrets 也能完整跑通。
```

- [ ] **Step 2: 写入只监听未来 `v*` tag 的 release workflow**

Create `.github/workflows/release.yml` with:

```yaml
name: Release

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: write
  pull-requests: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.32.1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Print tool versions
        run: |
          node -v
          pnpm -v
          pnpm exec turbo --version

      - name: Login Turbo remote cache
        if: ${{ env.TURBO_TOKEN != '' && env.TURBO_TEAM != '' }}
        run: pnpm exec turbo login --token="${{ env.TURBO_TOKEN }}" --team="${{ env.TURBO_TEAM }}"

      - name: Link Turbo remote cache
        if: ${{ env.TURBO_TOKEN != '' && env.TURBO_TEAM != '' }}
        run: pnpm exec turbo link --token="${{ env.TURBO_TOKEN }}" --scope="${{ env.TURBO_TEAM }}" --yes

      - name: Generate GitHub Release notes
        run: pnpm dlx changelogithub
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Expected:

```log
Release workflow 只对未来 `v*` tag 生效，不会因为历史 `@eams-monorepo/*@*` tag 生成 GitHub Release 页面。
```

- [ ] **Step 3: 本地检查 workflow 关键触发器没有跑偏**

Run:

```powershell
rg -n 'branches:|tags:|workflow_dispatch|TURBO_TOKEN|changelogithub' .github/workflows/ci.yml .github/workflows/release.yml
```

Expected:

```log
`ci.yml` 包含 `pull_request` / `push(main)` / `workflow_dispatch`；
`release.yml` 只包含 `tags: - "v*"` 与 `workflow_dispatch`；
两个 workflow 都包含可选的 Turbo 远程缓存步骤。
```

- [ ] **Step 4: 用 Prettier 校验 workflow 文件格式**

Run:

```powershell
pnpm exec prettier --check ".github/workflows/*.yml"
```

Expected:

```log
All matched files use Prettier code style!
```

- [ ] **Step 5: 提交 workflow 文件**

Run:

```powershell
git add .github/workflows/ci.yml .github/workflows/release.yml
git commit -m "ci(repo): add github actions for verify and release"
```

Expected:

```log
[main <sha>] ci(repo): add github actions for verify and release
```

---

### Task 4: 重写 README 的发版与自检叙事

**Files:**

- Modify: `README.md`

- [ ] **Step 1: 替换 README 里的“Changesets 主导发版”描述**

Apply this patch:

```diff
--- a/README.md
+++ b/README.md
@@
-## 工程化能力
+## 工程化能力
 - `pnpm workspace` 统一管理多包
 - `turbo` 组织构建、开发与任务编排
- - `changesets` 维护发版链路
+- `relizy` + `changelogen` 生成根级 `CHANGELOG.md` 与 release commit
+- `changelogithub` 在 GitHub Actions 中生成 GitHub Release
 - `eslint`、`prettier`、`simple-git-hooks`、`lint-staged` 负责代码质量收敛
 - `vitest` 覆盖组件库与文档站测试
```

Expected:

```log
README 的工程化能力描述不再把 `changesets` 当成主发布链路。
```

- [ ] **Step 2: 在快速开始后补充 CI 与 release 说明**

Apply this patch:

````diff
--- a/README.md
+++ b/README.md
@@
 ## 快速开始
 ```bash
 pnpm install
 pnpm lint
 pnpm build
 pnpm --filter @eams-monorepo/vue-element-cui test
 pnpm --filter @eams-monorepo/vue-element-cui-nuxt dev
````

+## CI 自检

- +`bash
+pnpm run ci
+`

  +该命令会顺序执行根级 lint、Turbo 构建、组件库测试，以及文档站生产构建。
  +GitHub Actions `ci.yml` 复用同一条命令链；当仓库配置了 `TURBO_TOKEN` 与 `TURBO_TEAM` 时，会自动接入 Turbo 远程缓存。

  +## 发版与 GitHub Release

- +`bash
+pnpm run release:relizy
+`

  +预演版本计划时使用：

- +`bash
+pnpm run release:changelog:dry-run
+pnpm run release:relizy:dry-run
+`

  +当前仓库的发布边界如下：
  +- 不执行 npm publish。
  +- `old/vue-element-cui` 只作为迁移对照保留，不参与新的 relizy bump 扫描。
  +- 只有未来新的根级 `v*` tag 会触发 GitHub Release workflow。
  +- 历史 `@eams-monorepo/*@*` tag 会继续保留，但不会生成 GitHub Release 页面。

  ```plain

  ```

Expected:

```log
README 开始准确描述“本地 relizy + 云端 GitHub Release”的链路，而不是继续停留在旧的 changesets 表述。
```

- [ ] **Step 3: 搜索并确认 README 没有残留错误发布语义**

Run:

```powershell
rg -n "changesets 维护发版链路|changeset publish|npm publish|hello-world" README.md
```

Expected:

```log
没有匹配项，或只剩“本仓库不执行 npm publish”这类明确的边界说明。
```

- [ ] **Step 4: 提交 README 叙事更新**

Run:

```powershell
git add README.md
git commit -m "docs(repo): document ci and github release workflow"
```

Expected:

```log
[main <sha>] docs(repo): document ci and github release workflow
```

---

### Task 5: 做最终联调与交付验证

**Files:**

- Verify only: working tree and all new release / workflow files

- [ ] **Step 1: 跑一遍完整本地自检**

Run:

```powershell
pnpm run ci
```

Expected:

```log
根级 lint、Turbo build、组件库测试和文档站 build 全部通过。
```

- [ ] **Step 2: 再跑一遍 relizy dry-run，确认没有意外发包动作**

Run:

```powershell
pnpm run release:changelog:dry-run
pnpm run release:relizy:dry-run
```

Expected:

```log
输出中没有 npm publish，也没有 `@eams-monorepo/vue-element-cui-legacy`；如果当前没有可 bump 内容，应只看到“无可发布变更”的结果而不是报错。
```

- [ ] **Step 3: 检查 release workflow 只匹配未来 `v*` tag**

Run:

```powershell
rg -n '@eams-monorepo/.+@|tags:' .github/workflows/release.yml
```

Expected:

```log
只出现 `tags:` 与 `v*` 的新触发器，不出现历史 `@eams-monorepo/*@*` 的匹配规则。
```

- [ ] **Step 4: 确认工作区只剩预期文件，必要时补最后一个提交**

Run:

```powershell
git status --short
```

Expected:

```log
没有输出；如果还有因验证暴露出的真实修复文件，再单独提交一个 verification/fix commit。
```

- [ ] **Step 5: 记录 GitHub 仓库启用所需 secrets**

Document this in the handoff summary:

```text
必需：GITHUB_TOKEN（GitHub Actions 默认提供）
可选：TURBO_TOKEN、TURBO_TEAM（仅用于 Turbo 远程缓存）
不需要：NPM_TOKEN
```

Expected:

```log
交付说明明确指出哪些 secrets 要配，哪些不再需要。
```
