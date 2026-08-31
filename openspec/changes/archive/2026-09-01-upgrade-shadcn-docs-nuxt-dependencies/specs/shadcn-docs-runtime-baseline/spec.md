## ADDED Requirements

### Requirement: 文档站必须锁定同一 Nuxt 3 运行时世代

系统 SHALL 让文档包实际解析到 `shadcn-docs-nuxt@1.1.9`、`@ztl-uwu/nuxt-content@2.13.9`、`nuxt@3.21.2`、`h3@1.15.11` 与 `nuxt-og-image@5.1.9`，并通过锁文件保持可复现；shadcn 传递的 `@nuxt/kit@4.x` 仅作为工具链依赖可存在，不得引入 H3 v2 或 Nuxt 4 runtime API。

#### Scenario: fresh install 解析树可解释

- **WHEN** 在干净依赖状态执行安装并检查依赖树
- **THEN** 上述五个核心包的实际版本与文档包 manifest/override 一致，H3 只有 1.15.11，且构建/产物运行时不加载 Nuxt 4/H3 v2 API

### Requirement: 运行时直接消费的依赖必须由文档包显式声明

系统 SHALL 在 `packages/vue-element-cui-nuxt/package.json` 中显式声明文档运行时直接导入的 H3、Content 与 workspace 组件库依赖，不依赖根目录提升或其他包的传递依赖。

#### Scenario: 部署包 manifest 闭包完整

- **WHEN** 只依据文档包 manifest 安装并构建生产产物
- **THEN** Nuxt Content、H3 和 workspace 组件库入口均可解析，且锁文件记录对应闭包
