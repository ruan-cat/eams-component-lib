import { getVueElementCuiAliases } from "./workspace-aliases";

const useWorkspaceSourceAliases =
	process.env.NODE_ENV === "development" && process.env.SHADCN_DOCS_USE_WORKSPACE_SOURCE === "1";

export default defineNuxtConfig({
	extends: ["shadcn-docs-nuxt"],

	// Nuxt 4.6 起，生产构建会把 buildDir 迁到 node_modules/.cache/nuxt/.nuxt
	// （@nuxt/kit dist/index.mjs:985）。该迁移会让 nitro 外部化路径在 Windows 上算错，
	// 并使 @ztl-uwu/nuxt-content 的 devStorage 基址与快照读取目录错位（内容库为空）。
	buildDir: ".nuxt",

	compatibilityDate: "2025-05-13",

	devtools: { enabled: true },

	alias: useWorkspaceSourceAliases ? getVueElementCuiAliases() : {},

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

	// Vite 8 的 rolldown 依赖优化器会把 @tailwindcss/oxide 的原生 .node 当 UTF-8 JS 解析而崩溃，
	// 留下半写的 deps 缓存（nostics.js 永久 pending），dev 客户端模块图卡死、hydration 失效。
	vite: {
		optimizeDeps: {
			exclude: ["@tailwindcss/oxide", "@tailwindcss/oxide-win32-x64-msvc"],
		},
		ssr: {
			optimizeDeps: {
				exclude: ["@tailwindcss/oxide", "@tailwindcss/oxide-win32-x64-msvc"],
			},
		},
	},

	nitro: {
		// Vercel NFT 闭包不含外部化包的传递依赖（ufo/entities），将导入方内联进 server bundle
		externals: {
			inline: [/node_modules/],
		},
		prerender: {
			// document-driven 模式必须预渲染，否则运行时 content 数据库为空
			crawlLinks: true,
		},
	},
});
