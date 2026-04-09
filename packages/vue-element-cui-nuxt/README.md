# @eams-monorepo/vue-element-cui-nuxt

`@eams-monorepo/vue-element-cui` 的展示站与文档站，基于 Nuxt 3 与 `shadcn-docs-nuxt`。

## 作用

- 展示组件库示例、布局和交互效果
- 承载组件文档与接入说明
- 为求职展示提供完整的工程化入口

## 本地开发

```bash
pnpm --filter @eams-monorepo/vue-element-cui-nuxt dev
pnpm --filter @eams-monorepo/vue-element-cui-nuxt build
pnpm --filter @eams-monorepo/vue-element-cui-nuxt generate
pnpm --filter @eams-monorepo/vue-element-cui-nuxt preview
```

## 测试

```bash
pnpm --filter @eams-monorepo/vue-element-cui-nuxt test
pnpm --filter @eams-monorepo/vue-element-cui-nuxt test:watch
```

## 文档维护

- 组件文档位于 `packages/vue-element-cui-nuxt/content/`
- 页面模板位于 `packages/vue-element-cui-nuxt/pages/`
- 展示组件位于 `packages/vue-element-cui-nuxt/app/components/`

## 访问地址

- 开发环境：`http://localhost:3000`
- 文档首页：`http://localhost:3000/docs/getting-started`

<!-- TODO: 故意触发发版 -->
