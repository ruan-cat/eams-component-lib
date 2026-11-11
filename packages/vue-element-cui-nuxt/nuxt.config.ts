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
		vercel: {
			functions: { runtime: "nodejs22.x" },
		},
		// Vercel 上 ipx 无法优化 SVG（sharp 缺 librsvg）致 /_ipx/_/logo*.svg 404；
		// 重定向到静态原图，保证 logo 可见
		routeRules: {
			"/_ipx/_/logo.svg": { redirect: "/logo.svg" },
			"/_ipx/_/logo-dark.svg": { redirect: "/logo-dark.svg" },
		},
		externals: {
			// 多版本包会被 nitro linkPackage 成 Windows 绝对 symlink，上传 Linux Vercel 后失效；
			// 目标性 inline 消除 symlink，使 .func 闭包自包含
			inline: [
				"ufo",
				"devalue",
				"entities",
				"hookable",
				"unhead",
				"parse5",
				"source-map-js",
				"vue-bundle-renderer",
				"h3",
				// element-plus 若外部化会运行时 import @popperjs/core(alias) 而闭包缺包；
				// 整条 UI 链 inline，使其依赖在构建期解析
				"element-plus",
				"@element-plus/icons-vue",
				"@popperjs/core",
				"@sxzz/popperjs-es",
				"@vueuse/core",
				"@vueuse/shared",
				"reka-ui",
				"defu",
				"debug",
				"lodash-es",
				"lodash-unified",
				"async-validator",
				"memoize-one",
				"normalize-wheel-es",
				"@ctrl/tinycolor",
				"dayjs",
			],
			traceOptions: { exportsOnly: false },
		},
		prerender: {
			// document-driven 模式必须预渲染，否则运行时 content 数据库为空
			crawlLinks: true,
		},
	},
});
