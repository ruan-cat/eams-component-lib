## Pilot Batch

- [x] [修改] `packages/vue-element-cui-nuxt/package.json` - 固定 Nuxt 3 文档运行时依赖、保留 `std-env` 与现有 `build`/`build:docs` → `build:vercel` 链路、补齐 H3/Content 直接声明并统一 prepare 脚本；验收为 manifest 与设计基线一致。
- [x] [修改] `package.json` - 增加 `pnpm.overrides.nuxt-og-image: 5.1.9`，不改变现有 workspace 依赖边界。
- [x] [修改] `package.json` - 增加精确 `tsdown@0.3.1>rolldown` override，确保公开 registry 可完成 workspace fresh install，且不覆盖 Nuxt/Vite 的 rolldown。
- [x] [修改] `package.json` - 为 Vercel 根构建闭包显式声明 `entities: ^7.0.1`；与文档包 manifest 共同提供 runtime trace 入口。
- [x] [修改] `packages/vue-element-cui-nuxt/nuxt.config.ts` - 收敛 alias、SSR externalization、Nitro trace/prerender 配置；保留 debug 窄兼容项并回退未经证实的 entities 白名单，Vercel 缺口记录为架构阻塞。
- [x] [验证] `pnpm-lock.yaml` - fresh install 后确认锁文件记录五包基线且无意外 Nuxt 4/H3 v2 运行时。
- [x] [验证] `openspec validate upgrade-shadcn-docs-nuxt-dependencies --strict` - 确认 proposal/spec/design/tasks 工件链有效。

## 主体任务

- [x] [验证] `packages/vue-element-cui-nuxt/workspace-aliases.ts` - 已复核 styles 前缀先于主入口，production alias 隔离由 `nuxt.config.ts` 环境门控实现；现有 helper 无需改动。
- [x] [验证] `prettier.config.mjs` - 已确认 Content Markdown `requirePragma` override 已存在，OXC 与 lint-md 配置保持不变。
- [x] [验证] `.prettierignore` - 已确认明确排除 `packages/vue-element-cui-nuxt/content/**/*.md`，防止 MDC 容器被格式化改写。
- [x] [验证] `packages/vue-element-cui-nuxt/content/**/*.md` - 全量扫描确认 16 个 `::demo-playground` 均具备标准 frontmatter、`#preview`/`#code` 与闭标记，未改变目录信息架构。
- [x] [新增] `packages/vue-element-cui-nuxt/tests/content/mdc-syntax.test.ts` - 已添加非法标题 marker、slot 外置、未闭合容器、frontmatter title/description 和裸 marker 扫描测试；隔离 checkout 执行全套测试结果为 9 个测试文件、12 个测试通过。
- [x] [验证] `packages/vue-element-cui-nuxt/turbo.json` 与 `turbo.json` - 已确认 docs build outputs 覆盖 `.vercel/output/**`，根 build/build:docs 覆盖 `.output/**`，并保留现有 Vercel artifact move 依赖；未执行无证据 `--force` cache。
- [x] [新增] `openspec/changes/upgrade-shadcn-docs-nuxt-dependencies/agent-progress.md` - 记录 checkpoint、当前 task、最近三项验证证据和下一步，保持摘要不超过 40 行。
- [x] [新增] `openspec/changes/upgrade-shadcn-docs-nuxt-dependencies/agent-findings.md` - 记录跨世代依赖、宽配置风险、失败路径与外部部署边界，去重并标注 active/resolved。
- [x] [验证] `pnpm --filter @eams-monorepo/vue-element-cui-nuxt exec nuxt prepare` - 隔离 checkout 确认 `.nuxt` 生成且无 Content/H3 导出错误。
- [x] [验证] `pnpm --filter @eams-monorepo/vue-element-cui-nuxt build` - Windows 默认 trace 长尾已记录；显式 `SHADCN_DOCS_SKIP_NFT_TRACE=1` 下 Vercel preset build 成功，且 node-server `.output` build 成功。
- [x] [验证] `.github/workflows/ci.yml` - GitHub Actions run `33402551030`（https://github.com/ruan-cat/eams-component-lib/actions/runs/33402551030）在 Linux 使用 frozen install、prepare、build 与测试全部成功；未启用 Windows trace workaround。
- [x] [验证] `packages/vue-element-cui-nuxt/.output/server/index.mjs` - 隔离 checkout 启动 node-server 生产产物，记录 PID、监听端口、启动日志与退出状态。
- [x] [验证] `packages/vue-element-cui-nuxt/tests` 与真实 HTTP 请求 - 请求首页、组件 demo 页、规范/更新页及 Content cache/search API，均返回 200/非空响应，页面无裸 MDC marker。
- [x] [验证] Vercel 项目部署 - Git push 触发生产 deployment `dpl_E3ShR447tNh6SqjBbLQXfWeWQwhz`，Vercel Git Integration build、functions artifact 与生产 alias 均 READY；HTTP smoke 与浏览器验收由子 change 完成。
- [x] [验证] `openspec validate upgrade-shadcn-docs-nuxt-dependencies --strict` 与 `git diff --check` - 已复核工件、代码、内容语法、锁文件和状态文件，确认未触碰 `docs/prompts/index.md`。

## Follow-up 子任务

- [x] [关联] `openspec/changes/fix-vercel-nitro-runtime-closure/` - 作为本 change F24 的专项子任务，已完成 Vercel/Nitro runtime closure、Git CI、Git Integration、HTTP 与 agent-browser 端到端验收；父 change 的依赖基线与配置减法已生效。
