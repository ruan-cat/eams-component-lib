# @eams-monorepo/vue-element-cui

基于 Element Plus 的现代 Vue 3 组件库。

> 当前仓库只围绕组件库本体、组件库展示站和历史迁移对照展开，不再绑定任何业务应用。
> 演示与文档请查看 `packages/vue-element-cui-nuxt`。

## 安装

```bash
pnpm add @eams-monorepo/vue-element-cui element-plus
```

## 全量注册

```ts
import { createApp } from "vue";
import VueElementCui from "@eams-monorepo/vue-element-cui";
import "@eams-monorepo/vue-element-cui/styles";

const app = createApp(App);
app.use(VueElementCui);
```

## 按需接入

```ts
import Components from "unplugin-vue-components/vite";
import { VueElementCuiResolver } from "@eams-monorepo/vue-element-cui/resolver";

Components({
	resolvers: [VueElementCuiResolver()],
});
```

## 自动导入

```ts
import AutoImport from "unplugin-auto-import/vite";
import {
	VueElementCuiAutoImportResolver,
	vueElementCuiImports,
	vueElementCuiTypeImports,
} from "@eams-monorepo/vue-element-cui/resolver";

AutoImport({
	resolvers: [VueElementCuiAutoImportResolver()],
	imports: [vueElementCuiImports, ...vueElementCuiTypeImports],
});
```

## 本地开发

```bash
pnpm --filter @eams-monorepo/vue-element-cui build
pnpm --filter @eams-monorepo/vue-element-cui dev
pnpm --filter @eams-monorepo/vue-element-cui test
pnpm --filter @eams-monorepo/vue-element-cui typecheck
```

## 发版标记

组件库仓库当前采用双轨发版：

- 子包继续使用 `@eams-monorepo/vue-element-cui@x.y.z` 形式的独立 tag
- 仓库根使用 `v*` 形式的聚合 tag，用于 GitHub Release 展示

## License

MIT

<!-- TODO: 故意触发发版 -->
