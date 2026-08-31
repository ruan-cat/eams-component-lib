## Context

父 change 已把文档站固定到 Nuxt 3 保守基线并删除宽 externalization，但 Vercel 远端候选部署仍在函数启动时失败。错误不是 `@ztl-uwu/nuxt-content` 解析 Markdown 时报错，而是 Vue SSR/CJS 编译链在运行时加载 `entities/decode` 时，函数 artifact 没有形成可部署闭包。

## Root-cause model

`@vue/compiler-core` 是 Vue 模板编译器；其 production CJS 文件由 Vue SSR 链接使用 `entities/decode` 解码 HTML entity。Nuxt Content/MDC 页面 SSR 会触发 Vue compiler，但错误发生在 Vercel function 启动，故排查顺序是：

1. Vercel 远端构建是否来自当前源码/当前 lockfile。
2. `.vercel/output/functions/**` 的入口、`package.json`、函数内 node_modules/内联模块是否包含 `entities`。
3. Nitro 生成阶段是否把 workspace/pnpm 路径写成绝对 file URL。
4. Vite SSR transform、Nitro Rollup、NFT trace 和 Vercel functions packaging 哪一层首次丢失子路径。
5. 只有首个阶段被证实后，才选择 manifest 修正、窄 alias/noExternal、窄 inline 或 artifact 搬运调整。

## Parent-boundary decisions

- 继承父 change 的 Nuxt 3/H3/Content/OG 版本基线与 `std-env`、`build:vercel` 入口。
- 不恢复父 change 删除的 Element Plus/VueUse/entities 整族 `noExternal`/`inline`。
- 不清空 Content prerender 路由，不用本地 Windows `trace:false` 产物冒充 Linux/Vercel artifact。
- `.output` node-server 与 `.vercel/output` Vercel functions 分别启动验证；CLI/Prebuilt 仅辅助，Git Integration 才是正式主链。

## Verification plan

- 复现父 change 当前 Vercel 失败并保存 deployment logs。
- 生成并检查本地/远端 functions artifact manifest，确认 `entities/decode` 和所有外部 file URL。
- 在 Linux/Vercel 端做单变量修复对照，分别记录 build、startup、HTTP 状态和日志。
- 通过 GitHub Actions 当前 commit 后，使用 agent-browser 访问首页、组件 demo、Content cache/search，采集 console 与交互证据。
- 若仍失败，停止配置试错，输出架构阻塞和下一 change 建议。
