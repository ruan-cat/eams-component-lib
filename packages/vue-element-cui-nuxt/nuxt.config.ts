import { createRequire } from "node:module";

import { isWindows } from "std-env";

import { getVueElementCuiAliases } from "./workspace-aliases";

const require = createRequire(import.meta.url);
const dayjsEsmEntry = require.resolve("dayjs/esm/index.js");
const mermaidEsmEntry = require.resolve("mermaid/dist/mermaid.esm.mjs");
const debugShimEntry = require.resolve("./shims/debug.ts");

export default defineNuxtConfig({
	extends: ["shadcn-docs-nuxt"],

	// https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
	compatibilityDate: {
		// https://v3.nitro.build/deploy/providers/cloudflare
		cloudflare: "2024-09-19",
		// https://nitro.build/deploy/providers/vercel#observability
		vercel: "2024-09-19",
	},

	devtools: { enabled: true },
	alias: getVueElementCuiAliases(),
	experimental: {
		appManifest: false,
	},

	build: {
		// 警告 不需要配置 "shiki" 因为最简单的 `shadcn-docs-nuxt-starter` 项目本身也没有配置 "shiki"
		transpile: ["ohash"],
	},

	vite: {
		optimizeDeps: {
			include: ["debug", "dayjs", "@braintree/sanitize-url", "mermaid"],
			esbuildOptions: {
				target: "esnext",
			},
		},
		resolve: {
			alias: [
				{
					find: /^dayjs$/,
					replacement: dayjsEsmEntry,
				},
				{
					find: /^mermaid$/,
					replacement: mermaidEsmEntry,
				},
				{
					find: /^debug$/,
					replacement: debugShimEntry,
				},
			],
			dedupe: ["dayjs"],
		},
		ssr: {
			/**
			 * 阻止 Vite SSR 构建将以下包外部化，强制在构建时解析并打入 server bundle。
			 *
			 * 背景：pnpm monorepo 的符号链接结构会导致 Vercel 的 @vercel/nft 依赖追踪
			 * 无法正确跟踪传递依赖（尤其是存在多版本的包，如 @vueuse/core 有 v12/v13/v14 三个版本）。
			 *
			 * 导入链：Nuxt SSR → @eams-monorepo/vue-element-cui（workspace 包）→ element-plus → @vueuse/core
			 * 如果不在此处阻止外部化，Vite 会将 workspace 包和 element-plus 标记为 external，
			 * 运行时从 node_modules 加载 ESM 文件，而 @vueuse/core 因 NFT 追踪失败不在 node_modules 中，
			 * 导致 ERR_MODULE_NOT_FOUND 崩溃。
			 *
			 * nitro.externals.inline 无法解决此问题——它作用于 Nitro Rollup 阶段，
			 * 但 Vite SSR 已经在更早的阶段将这些包外部化了。
			 */
			noExternal: [
				"debug",
				// workspace 组件库包：必须打入 bundle，否则运行时通过 workspace 符号链接加载会丢失上下文
				"@eams-monorepo/vue-element-cui",
				// element-plus 及其完整运行时依赖树
				/element-plus/,
				/@element-plus/,
				/@vueuse/,
				/vue-demi/,
				/@ctrl\/tinycolor/,
				/@floating-ui/,
				/@popperjs\/core/,
				/async-validator/,
				/escape-html/,
				/lodash-unified/,
				/lodash-es/,
				/memoize-one/,
				/normalize-wheel-es/,
				// @vue/compiler-core 依赖，曾因多版本（v4/v6/v7）导致 entities/decode 崩溃
				/entities/,
			],
		},
	},

	content: {
		highlight: {
			theme: {
				default: "github-light",
				dark: "houston",
			},
			preload: ["vue", "typescript", "javascript", "bash"],
		},
	},

	i18n: {
		defaultLocale: "zh-CN",
		locales: [
			{
				code: "zh-CN",
				name: "简体中文",
			},
		],
	},

	ogImage: {
		enabled: false,
	},

	icon: {
		/** 默认会扫描本地安装的全部 iconify 集合（可达上百个），Nitro 打包阶段极易 OOM；站点仅使用 lucide */
		serverBundle: {
			collections: ["lucide"],
		},
		clientBundle: {
			scan: true,
			sizeLimitKb: 512,
		},
	},

	nitro: {
		externals: {
			inline: [
				/element-plus/,
				/@element-plus/,
				/@vueuse/,
				/vue-demi/,
				/@ctrl\/tinycolor/,
				/@floating-ui/,
				/@popperjs\/core/,
				/async-validator/,
				/escape-html/,
				/lodash-unified/,
				/lodash-es/,
				/memoize-one/,
				/normalize-wheel-es/,
				/entities/,
			],
			// Windows + pnpm monorepo 下 @vercel/nft trace 会卡死；仅本地跳过，Vercel CI (Linux) 正常 trace
			...(isWindows ? { trace: false } : {}),
		},
		prerender: {
			crawlLinks: false,
		},
		hooks: {
			"prerender:routes"(routes: Set<string>) {
				routes.clear();
			},
		},
	},
});
