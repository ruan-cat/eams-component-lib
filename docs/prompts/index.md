# 杂项提示词

本 monorepo 项目的各种杂项提示词。目前由`糕鸭果`高频使用。不在乎项目是否干净，只在乎是否高效完成任务。

## 001 <!-- 已完成 --> $using-git-worktrees 为 admin 后台项目增加 11comm 项目的 iconify 方案

1. 阅读 https://01s-11comm-doc.ruan-cat.com/docs/reports/2025-11-14-pure-admin-icon-solution-research.md 报告
2. 在 `f1-ruancat` 分支的的基础上，新建一个功能分支，专门实现 admin 内容的集成。集成目标项目提供的 iconify 方案。
3. 务必使用工作树的开发模式，新建一个 git 工作树来完成这个功能开发。

## 002 <!-- 已完成 --> 增加后台项目对 iconify 的使用技能

在 `.claude\skills\use-iconify` 内，根据历史记忆 ， `apps\eams-frontend\src\components\ReIcon` 源码和 `apps\eams-frontend\src\views\sample\reicon` 具体案例。增加一款技能，专门用来指导如何在后台项目内，使用相关的 iconify 组合式函数和组件。

我希望这款 `use-iconify` 技能能够指导本项目的全部开发者，能够正常的集成并使用相关的 iconify 显示功能。

## 003 <!-- 已完成 --> 在别的项目内新增一款名为 `init-pure-admin-iconify` 的开发技能

本项目之前集成了 iconify 能力，效果很好。我经常要对一个 vite+vue3 架构的项目，初始化基于 vue3 的 iconify 图标渲染方案。初始化一揽子的 iconify 使用工具和函数。

1. 深刻阅读该报告 https://01s-11comm-doc.ruan-cat.com/docs/reports/2025-11-14-pure-admin-icon-solution-research.md ，该报告也指导了本项目如何初始化 iconify 使用工具。
2. 认真查看在后台项目内，本项目是如何配置实现 pure-admin 提供的 iconify 方案的。
3. 认真读取 memorix 关于此的记忆。
4. 在 `D:\code\github-desktop-store\gh.ruancat.monorepo\ai-plugins\dev-skills\skills` 目录内，根据其他 `D:\code\github-desktop-store\gh.ruancat.monorepo\ai-plugins\common-tools\skills` 技能的写法，模仿其 yaml 格式数据，编写一个 `init-pure-admin-iconify` 技能。

## 004 <!-- TODO: --> 将 nuxt docs 部署到 vercel 平台

这个项目的核心目的就是为了实现面试的展示，所以我需要将组件库文档对外展示出来。需要一个可用的地址出来。

将这整个项目部署到 vercel 平台内。其中，我要求你部署 `packages\vue-element-cui-nuxt` 项目。目前就要求你部署一个文档。

部署时的根目录识别，就是本项目的根目录。

### 完成该任务重点使用的工具

重点使用全局的 vercel 技能和 vercel MCP，完成项目部署。

### vercel 项目名称

`vue-element-cui-nuxt-doc`

### 链接域名

部署产物的域名为：

- `vue-element-cui.ruan-cat.com`
- `vec.ruan-cat.com`

你只需要完成配置，不需要你验证，应为这需要配置 CDN 到 cloudflare 内，我亲自来完成即可。

### 移动 nuxt 构建产物到项目根目录内，便于项目直接识别

阅读 D:\code\ruan-cat\notes\docs\my-pull-requests\package.json 的做法，这个项目也是在 monorepo 内，将一个子包 nuxt 项目，部署到 vercel 平台内。

你可以查看 vercel 的 `notes-my-pull-requests` 项目的做法，模仿其配置。

1. 务必使用 move-vercel-output-to-root 命令来完成产物移动。
   - 在 vercel 平台部署 monorepo 架构下的 nitro 接口或 nuxt 项目的注意事项： https://juejin.cn/post/7610816257119354915
   - move-vercel-output-to-root 命令的参考资料
2. 必须在 monorepo 根包内，配置 nuxt docs 文档站点的专用构建入口。模仿 D:\code\ruan-cat\notes 项目，即 D:\code\ruan-cat\notes\package.json 的做法。

### 可参考的例子

你可以查看 vercel 的 `notes-my-pull-requests` 项目的做法，模仿其配置。
