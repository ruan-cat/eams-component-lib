# 长任务进度

- Change：`upgrade-shadcn-docs-nuxt-dependencies`
- 当前 checkpoint：Pilot Batch / 任务 1-5（依赖与配置收敛）
- 状态：本地实现与验证完成；Vercel 远端 runtime closure 连续复现阻塞，按架构审查规则暂停在 F24。
- 已确认基线：Nuxt 3.21.2、shadcn-docs-nuxt 1.1.9、@ztl-uwu/nuxt-content 2.13.9、h3 1.15.11、nuxt-og-image 5.1.9。
- 已记录证据：现状 `pnpm list/why` 显示 nuxt-og-image 5.1.13、@nuxt/kit 3/4 双代、@nuxtjs/mdc 0.18/0.20 双代、h3 1.15.9。
- 已完成改动：文档包固定 Nuxt/H3/Content，根 override 固定 nuxt-og-image 5.1.9 与 tsdown rolldown；保留 std-env、build→build:vercel、debug 窄兼容、Windows trace opt-in；compatibilityDate 对齐 2025-05-13。
- 验证摘要：隔离 checkout frozen install 成功；`pnpm why` 显示 h3 1.15.11、nuxt-og-image 5.1.9；`nuxt prepare` 成功；Vercel preset build（skip trace）成功并生成 `.vercel/output`；node-server build 成功并生成 `.output/server/index.mjs`；docs tests 9 files/12 tests passed；artifact HTTP smoke 已返回首页/内容/API 200 且无裸 MDC marker；Prettier check 全部通过。
- 阻塞边界：Windows 默认 trace 长尾已证实；本机无 Linux/WSL/Docker，Linux CI 与真实 Vercel 仍需外部证据。
- 评审摘要：pilot scoped re-review 已确认依赖规格、测试路径和 MDC 覆盖问题修正；剩余未完成项仅为外部 Linux CI/Vercel 证据与 lockfile 大 diff 风险。
- 下一步：完成最终审计与 review；Linux Git CI、Vercel Git 主链及 `entities/decode` 远端闭包需另建架构 change/外部决策后继续。
