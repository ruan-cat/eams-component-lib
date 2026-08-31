## ADDED Requirements

### Requirement: 生产构建图不得使用无证据的宽配置

系统 SHALL 仅在可复现的首个失败门证实需要时启用 Vite SSR `noExternal`、Nitro `externals.inline` 或 source alias；生产默认不得把 workspace 源码和整棵 UI 依赖树强制打包。

#### Scenario: production 配置与 development source alias 隔离

- **WHEN** `NODE_ENV` 非 development 或未显式设置 `SHADCN_DOCS_USE_WORKSPACE_SOURCE=1`
- **THEN** 文档站不启用 workspace 源码 alias，并从部署包 manifest 的正常入口解析组件库

### Requirement: document-driven Content 必须保留预渲染

系统 SHALL 保留 Nuxt Content document-driven 预渲染与可用的 crawl 路径，不得默认清空 `prerender:routes`，以确保运行时 Content 数据库和搜索索引非空。

#### Scenario: Content 产物可在运行时读取

- **WHEN** 完成生产构建并启动 `.output` server
- **THEN** 内容页面及 cache/search API 返回成功状态和非空索引

### Requirement: Windows NFT workaround 必须显式 opt-in

系统 SHALL 仅在 Windows 且设置 `SHADCN_DOCS_SKIP_NFT_TRACE=1` 时关闭 Nitro NFT trace；Linux/CI/Vercel 默认保留 trace。

#### Scenario: Linux 构建保留依赖追踪

- **WHEN** 在 Linux CI 或 Vercel 构建
- **THEN** 配置不因平台判断自动关闭 trace，最终产物完成正常依赖追踪
