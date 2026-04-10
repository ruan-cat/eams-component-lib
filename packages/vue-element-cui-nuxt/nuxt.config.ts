import { createRequire } from "node:module";

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
			noExternal: ["debug"],
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
			/**
			 * 将全部依赖内联进 server bundle，使云函数无需 node_modules 即可运行。
			 * 这同时规避了 Windows + pnpm workspace 下 @vercel/nft trace 长期卡死的问题。
			 */
			inline: [/.*/],
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
