import { createRequire } from "node:module";

import { isWindows } from "std-env";

import { getVueElementCuiAliases } from "./workspace-aliases";

const require = createRequire(import.meta.url);
const dayjsEsmEntry = require.resolve("dayjs/esm/index.js");
const mermaidEsmEntry = require.resolve("mermaid/dist/mermaid.esm.mjs");
const debugShimEntry = require.resolve("./shims/debug.ts");
const useWorkspaceSourceAliases =
	process.env.NODE_ENV === "development" && process.env.SHADCN_DOCS_USE_WORKSPACE_SOURCE === "1";
const workspaceAliases = useWorkspaceSourceAliases ? getVueElementCuiAliases() : {};

export default defineNuxtConfig({
	extends: ["shadcn-docs-nuxt"],

	// Keep the shared Nuxt 3 baseline explicit for each deployment provider.
	// The date is the previously validated baseline; changing its shape must not
	// silently opt the document site into a newer Nitro preset behavior.
	compatibilityDate: {
		// https://v3.nitro.build/deploy/providers/cloudflare
		cloudflare: "2024-09-19",
		// https://nitro.build/deploy/providers/vercel#observability
		vercel: "2024-09-19",
	},

	devtools: { enabled: true },
	app: {
		head: {
			link: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon.svg",
				},
			],
		},
	},
	alias: workspaceAliases,
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
			// 仅保留已复现 debug ESM/CJS 入口问题所需的窄兼容入口。
			noExternal: ["debug", "@vueuse/core", "element-plus"],
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
			// Vercel function runtime must carry the Vue compiler's subpath dependency.
			inline: ["entities"],
			// 仅在 Windows 且显式确认 NFT trace 长尾时跳过；Linux/Vercel 默认保留 trace。
			...(isWindows && process.env.SHADCN_DOCS_SKIP_NFT_TRACE === "1" ? { trace: false } : {}),
		},
		prerender: {
			// 文档站使用 document-driven 模式，必须开启预渲染才能在构建时解析 content markdown
			// 为预解析对象并存入缓存；禁用预渲染会导致运行时 content 数据库为空。
			crawlLinks: true,
		},
	},
});
