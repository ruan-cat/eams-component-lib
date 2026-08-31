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

## 004 <!-- 已完成 --> 将 nuxt docs 部署到 vercel 平台

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

## 005 <!-- 已完成 2026-9-1； codex pro20 正在做 --> 整体升级并排查 shadcn-docs-nuxt 的依赖隐患问题

### 任务设计

我们的 shadcn-docs-nuxt 在其他项目内事实上出现极其严重的故障，我真的对此很愤怒。

我要求你做好一个艰巨任务的准备，我要根据最新的全局技能 `init-shadcn-docs-nuxt` 的指导，对本项目的 nuxt content ，做全面的依赖升级。

升级后，你按照这样的步骤完成全面的校验：

```txt
fresh install
↓
pnpm why
↓
Nuxt prepare
↓
Windows build
↓
Linux CI build
↓
.output startup
↓
真实 HTTP smoke
↓
Vercel
```

---

用最新的 `init-shadcn-docs-nuxt` 技能来修改调整 eams-component-lib 组件库项目

阅读这些上下文：

- https://github.com/ruan-cat/SmallAliceWeb/pull/11/
- 最新的全局技能 `init-shadcn-docs-nuxt` 技能。

1. 配置处理： `D:\code\ruan-cat\eams-component-lib` 项目是组件库项目，用了 nuxt 文档站点，这个项目之前用的是比较脏的方式完成依赖的控制，进而完成 build 故障处理的。按照最新的技能指导，我要求你完成对这个项目的配置改写，确保我们的这款项目能够完整的依据最新的技能指导，实现统一的故障处理和配置。我很不喜欢每一个项目都有自己独特的，散落到各地的配置。
2. 更新组件库文档的组件使用： 本技能更新了 mdc 的组件使用方式，请你也做出同步的更改。
3. 在 memorix 内记录状态和决策。如果你完成了修复，请你记得更新本项目的内部 memorix 的历史记录信息。

及时使用本地 memorix MCP 存储本次会话的记忆
请你及时使用 memorix MCP，将本次会话出现的错误误区，经验教训，重大更改决策等内容，存储到本地记忆内。避免下次再出现类似的错误。主动使用`memorix_session_start`工具，显式项目绑定建立项目上下文，再用项目 scope 检索；如果超时失败，或用 CLI `memorix memory search` 兜底，或者是其他直接的 memorix cli 来完成记忆读取和和存储任务

### <!-- codex pro20 正在做 --> 2026-8-31 沟通，推进 `upgrade-shadcn-docs-nuxt-dependencies` 任务

采用“新建 OpenSpec change + Nuxt 3 保守基线（含 nuxt-og-image@5.1.9 override）+ 全链路验证”的方案。

---

但 HTTP 持续报 Cannot find module 'entities/decode'，已连续多轮验证，记录为 F24 架构阻塞。
这是什么东西，我们的云 vercel 流水线失败了么？我们没有完成生产环境的构建和本地 agent browser 的实际浏览器使用么？
你认为应该要新建一个全新的 openspec change 来专项解决这个问题么？还是说你这个 change 任务工件不适合呢？

---

`@vue/compiler-core -> vue -> entities/decode` 这是什么错误链路？我之前没见过啊，难道 nuxt content 又出现全新的错误了？这太折磨人了。
好吧，我允许你新建一个全新的 fix-vercel-nitro-runtime-closure 的 openspec 任务工件，但是你要说明，`fix-vercel-nitro-runtime-closure` 任务工件本质上是 `upgrade-shadcn-docs-nuxt-dependencies` 任务的子任务。
`是 Vercel/Nitro/Vite SSR/依赖追踪/函数打包边界上的生产闭包问题。`

### 2026-8-31 处理 `fix-vercel-nitro-runtime-closure` 子任务

`是 Vercel/Nitro/Vite SSR/依赖追踪/函数打包边界上的生产闭包问题。`

这太古怪了，为什么在 `D:\code\ruan-cat\SmallAliceWeb` 这款项目内，没有出现这个 vercel function 的问题呢？

---

是不是 packages\vue-element-cui-nuxt\nuxt.config.ts 的 `compatibilityDate: "2025-05-13",` 问题？是不是构建后的产物，由于格式问题，复制失败了？

---

你在 D:\code\ruan-cat\eams-component-lib\docs\reports\2026-8-31-fix-shadcn-docs-nuxt 目录内编写报告，说明清楚你是怎么完成故障修复，以及你做了哪些 SSR 层面上的努力。你是怎么解决 vercel function 缺失模块的情况的？compatibilityDate 设置成 2024-09-19 有没有帮助？

---

针对 `docs\reports\2026-8-31-fix-shadcn-docs-nuxt\2026-08-31-fix-shadcn-docs-nuxt.md` 报告，你最重要的修复就是这个吧，让 nitro 内联 entities 依赖。你之前不是也处理过很多这样的依赖么？按照全局技能 init-shadcn-docs-nuxt 的指导，不是应该避免这种精细化处理么？还是说你刚才的修改，你从来没有去看 init-shadcn-docs-nuxt 技能的指导么？这是你的失误么？

```ts
nitro: {
	externals: {
		inline: ["entities"],
	},
},
```

"nuxt-og-image": "5.1.9" 和 "tsdown@0.3.1>rolldown": "1.0.0-beta.13-commit.024b632" 这两个依赖，你又是修复什么东西呢？为什么比 `init-shadcn-docs-nuxt` 技能多了一些东西呢？

---

我现在允许你继续用 git-commit 的方式，继续推进，我要看看 vercel 生产环境到底是不是你说的已经成功构建了，给我最新的证据。

---

用本项目提供的 relizy 以及 package.json 通过的命令，对本次破坏性的重大 bug 修复突破，做发版。更新合适的版本号。

你用了什么命令来完成发版啊？我们现成的根包命令要更改么？适合我们本次的任务么？

`fix-vercel-nitro-runtime-closure` 子任务你认为是否完成了？`upgrade-shadcn-docs-nuxt-dependencies` 任务是否也已经完成了？

## 006 `fix-vercel-nitro-runtime-closure` 与 `upgrade-shadcn-docs-nuxt-dependencies` 完成确认

- `fix-vercel-nitro-runtime-closure` 已完成：Vercel/Nitro runtime closure、Linux 构建、生产 HTTP smoke 与可见浏览器验收均通过。
- `upgrade-shadcn-docs-nuxt-dependencies` 已完成：依赖基线、配置收敛、内容语法、CI、`.output` 启动及 Vercel 生产部署均已验证。
- 关联 OpenSpec 变更已通过严格校验，父任务与专项子任务均保留可复核的 `tasks.md`、`agent-progress.md` 和报告证据。

## 007 <!-- TODO: -->
