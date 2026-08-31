## ADDED Requirements

### Requirement: 文档站必须按分层证据矩阵验收

系统 SHALL 按 fresh install、依赖 why、Nuxt prepare、Windows build、Linux CI build、`.output` startup、真实 HTTP smoke 和 Vercel 证据顺序执行验收，并记录每一层的退出码、产物和关键响应。

#### Scenario: 本地产物可独立启动

- **WHEN** Windows 构建结束并启动 `.output/server/index.mjs`
- **THEN** 进程保持存活，首页、至少一个 Content 页面及 cache/search API 均返回符合预期的 HTTP 响应

#### Scenario: 外部部署边界透明

- **WHEN** 当前环境缺少 Vercel 凭据或部署权限
- **THEN** 报告明确区分本地/CI 证据与未完成的外部部署门，不得以本地成功代替 Vercel 验收
