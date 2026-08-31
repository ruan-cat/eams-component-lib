# Changelog

## @eams-monorepo/vue-element-cui-nuxt@4.0.0 (2026-08-31)

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/@eams-monorepo/vue-element-cui-nuxt@3.0.0...@eams-monorepo/vue-element-cui-nuxt@4.0.0)

### ✨ 新增功能

- **vercel:** 接入 Nuxt 文档站 monorepo Vercel 构建链路与产物回迁 ([1ccfbaa](https://github.com/ruan-cat/eams-component-lib/commit/1ccfbaa))

  为根与子包增加 Turbo 构建任务，使用 nuxi vercel 预设与 move-vercel-output-to-root，将 .vercel/output 回迁至仓库根以便部署识别；补充 .gitignore 忽略本地 .vercel 链接目录，并更新子包脚本与 pnpm 锁文件。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### 🐞 修复缺陷

- **nuxt-doc:** 为 Vercel 与 Cloudflare 拆分 Nitro compatibilityDate ([52ba0cf](https://github.com/ruan-cat/eams-component-lib/commit/52ba0cf))

  将单一 compatibilityDate 改为按部署提供方（vercel、cloudflare）分别指定，对齐 Nitro 官方文档建议，修复文档站在 Vercel 构建 Nitro 产物时的兼容档位问题。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **nuxt-doc:** 用 inline 替换 trace:false 修复 Vercel 云函数依赖缺失 ([213d8d5](https://github.com/ruan-cat/eams-component-lib/commit/213d8d5))

  nitro.externals.trace=false 关闭了 @vercel/nft 文件追踪，导致构建产物
  \_\_fallback.func 内缺失 node_modules 和 package.json，Vercel 云函数运行时
  找不到依赖直接报错。改用 externals.inline=[/.*/] 让 Rollup 将全部依赖
  内联进 server bundle，云函数完全自包含，同时绕开 Windows + pnpm workspace
  下 @vercel/nft 长期卡死的问题。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>
  Co-authored-by: Claude <noreply@anthropic.com>

- **nuxt-doc:** 移除 nitro externals.inline 修复 Vercel 运行时模块缺失 ([aab4edb](https://github.com/ruan-cat/eams-component-lib/commit/aab4edb))

  inline=[/.*/] 在本地能生成自包含 bundle，但 Vercel 构建框架在 Nitro 之后
  会再跑一次 @vercel/nft 追踪，检测到残留的 require() 引用后从 node_modules
  重新拷贝了不完整的 Vue 运行时（缺少 entities/decode），导致运行时报错
  Cannot find module 'entities/decode'。
  移除 externals 配置，让 Nitro 使用默认的 @vercel/nft trace 行为。Vercel
  在 Linux 上构建，不存在 Windows + pnpm workspace 下的 trace 卡死问题。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>
  Co-authored-by: Claude <noreply@anthropic.com>

- **nuxt-doc:** 显式声明 entities 依赖修复 Vercel 云函数模块缺失 ([211c662](https://github.com/ruan-cat/eams-component-lib/commit/211c662))

  @vue/compiler-core@3.5.30 需要 entities@7.x 的 entities/decode 子路径导出，
  但项目依赖树中存在 entities@4.5.0、@6.0.1、@7.0.1 三个版本，Nitro trace
  可能追踪到错误版本。将 entities@^7.0.1 加为文档站的显式 dependencies 并在
  pnpm-workspace.yaml 的 overrides 中统一锁定，确保 Vercel 构建产物包含
  正确版本的 entities。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>
  Co-authored-by: Claude <noreply@anthropic.com>

- **nuxt-doc:** 按平台区分 Nitro externals 并定点内联依赖 ([6d6061a](https://github.com/ruan-cat/eams-component-lib/commit/6d6061a))

  使用 std-env 的 isWindows：仅在 Windows 本地构建时对 nitro.externals 启用 trace:false 以规避 @vercel/nft 卡死；Linux/Vercel 保留默认追踪。为 element-plus、entities 等增加 inline 正则，降低 SSR 云函数缺包概率。在文档站 package.json 显式声明 std-env 依赖并更新 pnpm 锁文件。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **nuxt-doc:** 通过 vite ssr.noExternal 修复 Vercel 云函数 @vueuse/core 模块缺失 ([159fabd](https://github.com/ruan-cat/eams-component-lib/commit/159fabd))

  pnpm monorepo 的符号链接结构导致 Vercel @vercel/nft 无法追踪 element-plus
  的传递依赖（@vueuse/core 存在 v12/v13/v14 三个版本，NFT 选错或丢失）。
  nitro.externals.inline 无法解决此问题，因为 Vite SSR 在更早阶段已将这些包
  外部化。改用 vite.ssr.noExternal 在构建时直接将 workspace 组件库包及
  element-plus 完整依赖树打入 server bundle，彻底绕过运行时 node_modules 解析。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **nuxt-doc:** 恢复预渲染修复生产环境 content 数据库为空 ([8d91882](https://github.com/ruan-cat/eams-component-lib/commit/8d91882))

  document-driven 模式的 Nuxt Content 依赖预渲染阶段解析 markdown 为结构化对象
  并存入缓存。之前为避免构建卡死而完全禁用预渲染（crawlLinks: false + routes.clear()），
  导致 Nitro 仅打包原始 markdown 字符串到 cache:content:parsed 命名空间，
  运行时 cached.parsed 返回 undefined，content 数据库为空，
  shadcn-docs-nuxt 的 index.vue 访问 page.\_id 时触发 TypeError 崩溃。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **vue-element-cui-nuxt:** 修正文档站 GitHub 仓库跳转地址 ([d33eac7](https://github.com/ruan-cat/eams-component-lib/commit/d33eac7))

  将文档站头部、页脚和目录中的 GitHub 入口统一指向当前仓库，
  避免继续跳转到历史的 eams/vue-element-cui 地址。
  Co-authored-by: Codex (client)
  Co-authored-by: GPT-5 (model)

- 补齐文档站 favicon ([c1187eb](https://github.com/ruan-cat/eams-component-lib/commit/c1187eb))

  新增组件网格徽章 SVG favicon，并在 Nuxt head 中显式声明 image/svg+xml 图标资源，避免生产环境继续回退到 HTML。
  补充 Vitest 覆盖 favicon 资源结构和 Nuxt head 配置，防止后续遗漏静态资源或链接声明。

- **nuxt-doc:** 将 entities 纳入 Nitro 函数闭包 ([27cb1ae](https://github.com/ruan-cat/eams-component-lib/commit/27cb1ae))

  针对 Vercel Function 启动时的 `@vue/compiler-core` → `entities/decode` 缺包错误，先在 Nitro externalization 阶段显式 inline `entities`，用单变量验证产物闭包是否完整。
  Assisted-by: Codex / GPT-5

- **nuxt-doc:** 内联 VueUse SSR 入口 ([17cca5c](https://github.com/ruan-cat/eams-component-lib/commit/17cca5c))

  将 `@vueuse/core` 从 Vite SSR externalization 移入 Nuxt server bundle，确保 Element Plus 的 `use-calc-input-width` 运行时不依赖 Vercel NFT 对 pnpm 传递依赖的推断。
  Assisted-by: Codex / GPT-5

- **nuxt-doc:** 内联 Element Plus SSR 依赖链 ([26542e5](https://github.com/ruan-cat/eams-component-lib/commit/26542e5))

  将 Element Plus 与已内联的 VueUse SSR 入口一并打入 Nuxt server bundle，避免 Vercel Function 运行时从 pnpm 外部依赖树解析缺失包。
  Assisted-by: Codex / GPT-5

- **nuxt-doc:** 内联 Popper 实际包入口 ([92bcf22](https://github.com/ruan-cat/eams-component-lib/commit/92bcf22))

  将 pnpm 别名解析后的 `@sxzz/popperjs-es` 纳入 Vite SSR bundle，避免 Element Plus 产物继续保留无法由 Vercel Function 解析的外部 Popper 导入。
  Assisted-by: Codex / GPT-5

- **nuxt-doc:** 映射 Popper alias 到可打包入口 ([8da2aed](https://github.com/ruan-cat/eams-component-lib/commit/8da2aed))

  将 `@popperjs/core` alias 映射到已声明包的绝对 ESM 入口，消除 pnpm alias 在 Vercel Nitro server bundle 中留下的外部模块解析缺口。
  Assisted-by: Codex / GPT-5

- **nuxt-doc:** 内联 Reka UI 运行时依赖 ([d0db7e4](https://github.com/ruan-cat/eams-component-lib/commit/d0db7e4))

  将 `reka-ui` 与其 `defu` 入口纳入 Vite SSR bundle，继续闭合 Element Plus 文档组件链在 Vercel Function 中的外部依赖解析。
  Assisted-by: Codex / GPT-5

### 📖 Documentation

- **readme:** 收敛 monorepo 开发命令示例 ([1d8a5f5](https://github.com/ruan-cat/eams-component-lib/commit/1d8a5f5))

  更新根 README 与两个包 README 的开发、测试和 CI 命令示例，使其和新的
  Turbo 调度方式保持一致。
  包级示例改为使用 pnpm --dir，本地说明不再继续传播 --filter 串联做法。

### 🔨 构建相关

- **monorepo:** ⚠️ 用 Turbo 统一 CI 与文档构建调度 ([5e710e0](https://github.com/ruan-cat/eams-component-lib/commit/5e710e0))

  将根脚本收敛为 build、test、build:docs 三个通用入口，并让文档站通过 Turbo
  任务依赖自动拉起组件库构建，替代手工 --filter 串联。
  同时把 old/vue-element-cui 移出 pnpm workspace 主链路，避免旧包继续参与当前仓库的
  Turbo 任务图和 CI 调度。
  BREAKING CHANGE: old/vue-element-cui 不再属于当前 workspace；依赖 pnpm --filter 串联组件库测试或文档站构建的本地脚本，需要改为使用根级 pnpm run test / pnpm run build:docs。

- **nuxt-doc:** 先构建 workspace 组件再生成 Vercel 函数 ([951272d](https://github.com/ruan-cat/eams-component-lib/commit/951272d))

  为 Vercel 文档构建任务补充 `^build` 依赖，确保干净 Git checkout 会先生成组件库 dist 入口，再执行 Nuxt Nitro 构建，避免 workspace 包入口解析失败。
  Assisted-by: Codex / GPT-5

### 🔧 更新配置

- 统一添加 package.json 的 author 字段 ([ef0dc00](https://github.com/ruan-cat/eams-component-lib/commit/ef0dc00))
- **nuxt-doc:** 收敛文档站运行时构建配置 ([4b3cd9a](https://github.com/ruan-cat/eams-component-lib/commit/4b3cd9a))

  统一 Nuxt 3 兼容日期的平台对象配置，限制 workspace source alias 只在显式开发模式生效，并移除未经产物证据支持的宽 SSR externalization，保留 Windows NFT trace 的显式 opt-in。
  Assisted-by: Codex / GPT-5

- **nuxt-doc:** 移除 Nitro externals 常驻覆盖 ([7cc6494](https://github.com/ruan-cat/eams-component-lib/commit/7cc6494))

  遵循 init-shadcn-docs-nuxt 的生产图边界，删除 `nitro.externals` 的 inline/trace 配置，让 Linux/Vercel 使用默认依赖追踪；运行时依赖继续由 manifest、pnpm override 和精确 Vite 入口负责闭合。
  Assisted-by: Codex / GPT-5

#### ⚠️ Breaking Changes

- **monorepo:** ⚠️ 用 Turbo 统一 CI 与文档构建调度 ([5e710e0](https://github.com/ruan-cat/eams-component-lib/commit/5e710e0))

  将根脚本收敛为 build、test、build:docs 三个通用入口，并让文档站通过 Turbo
  任务依赖自动拉起组件库构建，替代手工 --filter 串联。
  同时把 old/vue-element-cui 移出 pnpm workspace 主链路，避免旧包继续参与当前仓库的
  Turbo 任务图和 CI 调度。
  BREAKING CHANGE: old/vue-element-cui 不再属于当前 workspace；依赖 pnpm --filter 串联组件库测试或文档站构建的本地脚本，需要改为使用根级 pnpm run test / pnpm run build:docs。

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @eams-monorepo/vue-element-cui-nuxt@3.0.0 (2026-04-09)

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/@eams-monorepo/vue-element-cui-nuxt@2.0.0...@eams-monorepo/vue-element-cui-nuxt@3.0.0)

### 🦄 代码重构

- **repo:** ⚠️ Flatten monorepo to repository root ([c9c0b44](https://github.com/ruan-cat/eams-component-lib/commit/c9c0b44))
- **vue-element-cui,config,vue-element-cui-nuxt:** 优化代码结构。 ([4272334](https://github.com/ruan-cat/eams-component-lib/commit/4272334))

  故意触发发版

- **release:** ⚠️ 调整包级 README 的发版触发标记 ([7e16b6e](https://github.com/ruan-cat/eams-component-lib/commit/7e16b6e))

  统一更新组件库与文档站 README 里的故意触发发版标记，避免继续沿用旧的占位写法。
  这次变更将包级 README 的发版触发注释收敛到新的编号形式，方便后续按文档变更继续触发版本流程。
  BREAKING CHANGE: 包级 README 中用于人工触发发版的注释标记已从旧的 `<!-- TODO: 故意触发发版 -->` 调整为 `<!-- TODO: 故意触发发版 1 -->`；依赖旧注释文本做脚本匹配或人工约定的流程需要同步更新。

### 📖 Documentation

- **repo:** Rewrite component library showcase narrative ([6f4441b](https://github.com/ruan-cat/eams-component-lib/commit/6f4441b))

### 🔧 更新配置

- **package.json,vue-element-cui-nuxt:** ⚠️ 移除保守的私包配置，避免出现无法生成版本号的情况。 ([fac697d](https://github.com/ruan-cat/eams-component-lib/commit/fac697d))

#### ⚠️ Breaking Changes

- **repo:** ⚠️ Flatten monorepo to repository root ([c9c0b44](https://github.com/ruan-cat/eams-component-lib/commit/c9c0b44))
- **release:** ⚠️ 调整包级 README 的发版触发标记 ([7e16b6e](https://github.com/ruan-cat/eams-component-lib/commit/7e16b6e))

  统一更新组件库与文档站 README 里的故意触发发版标记，避免继续沿用旧的占位写法。
  这次变更将包级 README 的发版触发注释收敛到新的编号形式，方便后续按文档变更继续触发版本流程。
  BREAKING CHANGE: 包级 README 中用于人工触发发版的注释标记已从旧的 `<!-- TODO: 故意触发发版 -->` 调整为 `<!-- TODO: 故意触发发版 1 -->`；依赖旧注释文本做脚本匹配或人工约定的流程需要同步更新。

- **package.json,vue-element-cui-nuxt:** ⚠️ 移除保守的私包配置，避免出现无法生成版本号的情况。 ([fac697d](https://github.com/ruan-cat/eams-component-lib/commit/fac697d))

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))
