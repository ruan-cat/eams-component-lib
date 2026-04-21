<!-- 已完成 -->

# Vue Element CUI Nuxt Favicon Design

## 背景

`@eams-monorepo/vue-element-cui-nuxt` 是组件库文档站，线上地址为 `https://vec.ruan-cat.com`。当前生产环境缺少可用的 `favicon.svg`：浏览器访问 `/favicon.svg` 时返回 HTML fallback，而不是 `image/svg+xml` 资源，导致浏览器标签页无法展示代表组件库的图标。

现有文档站已经有页头品牌资源：

- `packages/vue-element-cui-nuxt/public/logo.svg`
- `packages/vue-element-cui-nuxt/public/logo-dark.svg`

本次 favicon 设计不替换现有页头 logo，而是补齐浏览器标签页、书签、搜索结果等小尺寸场景所需的独立图标。

## 目标

1. 为 `@eams-monorepo/vue-element-cui-nuxt` 设计一个抽象组件库图标，主题为“组件网格徽章”。
2. 使用纯 SVG 绘制，适合作为 `favicon.svg`，避免依赖位图资源。
3. 图标在 16px、32px、64px 小尺寸下仍能辨认出组件模块轮廓。
4. 在 Nuxt 文档站中显式声明 favicon，避免线上继续回退到 HTML。
5. 保持现有页头 `logo.svg` 与 `logo-dark.svg` 不变，降低品牌资产变更范围。

## 非目标

1. 不重做文档站页头 logo。
2. 不引入新的图标库、图片处理依赖或构建插件。
3. 不修改 `packages/vue-element-cui` 组件库源码。
4. 不调整 `nuxt.config.ts` 中与 Nitro externals、Vercel trace、SSR noExternal 相关的部署稳定配置。
5. 不设计包含 `VEC`、`CUI`、`FN` 等字母的标识。

## 设计方向

采用“组件网格徽章”方案：

- 外层是深色圆角方形徽章，延续当前文档站 logo 的深蓝底色气质。
- 内部使用 2x2 抽象模块块面表达组件库能力。
- 模块之间使用细连接线表达组件拼装、组合和配置化。
- 使用天蓝作为主强调色，呼应 Element Plus 与现有站点的 sky 色系。
- 使用少量 Vue 绿色点缀，表达 Vue 3 技术栈，但不复制 Vue 官方 logo。
- 不使用文字，保证 favicon 小尺寸清晰。

## 视觉规格

- SVG 画布：`viewBox="0 0 64 64"`。
- 底座：深蓝圆角矩形，建议接近 `#0F172A`，圆角控制在 14 到 16。
- 组件模块：4 个圆角小矩形或方块，使用浅色填充与描边区分层级。
- 连接线：使用蓝色细线，线宽控制在 3 到 4，端点圆润。
- 点缀色：Vue 绿色只用于一个节点或一处小块，不成为主色。
- 小尺寸优先：避免过细线条、复杂渐变、阴影、过多路径和微小文字。

## 文件与集成点

计划新增：

- `packages/vue-element-cui-nuxt/public/favicon.svg`

计划修改：

- `packages/vue-element-cui-nuxt/nuxt.config.ts` 或文档站当前可用的 head 配置入口，显式声明 `/favicon.svg` 为 `image/svg+xml` favicon。

保留不变：

- `packages/vue-element-cui-nuxt/public/logo.svg`
- `packages/vue-element-cui-nuxt/public/logo-dark.svg`
- `packages/vue-element-cui/package.json`
- `packages/vue-element-cui` 组件库源码

## 行为要求

1. 本地和生产访问 `/favicon.svg` 应返回 SVG 内容，而不是 Nuxt HTML fallback。
2. 页面 HTML head 中应出现 favicon link，浏览器无需猜测默认路径。
3. favicon SVG 应能直接由浏览器渲染，不依赖 CSS、脚本、字体或外链资源。
4. 图标文件应保持简洁，便于后续人工维护。

## 验证方案

实施完成后至少验证：

1. 运行文档站测试：

   ```bash
   pnpm --dir packages/vue-element-cui-nuxt test
   ```

2. 构建文档站：

   ```bash
   pnpm --dir packages/vue-element-cui-nuxt build
   ```

3. 本地检查 `/favicon.svg` 返回内容类型与 SVG 文本。
4. 使用浏览器检查页面 head 中存在 `/favicon.svg` link。
5. 生产部署后检查 `https://vec.ruan-cat.com/favicon.svg` 返回 `image/svg+xml`。

## 风险与缓解

### 风险 1：SVG 细节过多，小尺寸不可读

缓解方式：只保留 4 个模块块面、一条主要连接线和一个绿色点缀，不使用文字和复杂阴影。

### 风险 2：favicon 资源存在但没有被页面声明

缓解方式：除了新增 `public/favicon.svg`，还在 Nuxt head 中显式声明 favicon link。

### 风险 3：误改 Nuxt 部署稳定配置

缓解方式：实现阶段只做静态资源和 head 配置的最小变更，不改 Nitro externals、SSR noExternal、Vercel trace 相关配置。

### 风险 4：与现有页头 logo 产生品牌割裂

缓解方式：保留深蓝圆角徽章底座与天蓝主强调色，使 favicon 和现有 `logo.svg` 属于同一视觉家族，但内部符号改为组件网格。
