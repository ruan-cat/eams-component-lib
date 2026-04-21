import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { afterEach, describe, expect, test, vi } from "vitest";

type HeadLink = {
	rel?: string;
	type?: string;
	href?: string;
};

type DocsNuxtConfig = {
	app?: {
		head?: {
			link?: HeadLink[];
		};
	};
};

const loadNuxtConfig = async () => {
	vi.resetModules();
	vi.stubGlobal("defineNuxtConfig", <T>(config: T) => config);

	const module = await import("../../nuxt.config.ts");

	return module.default as DocsNuxtConfig;
};

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("docs site favicon", () => {
	test("declares the SVG favicon in Nuxt head", async () => {
		const nuxtConfig = await loadNuxtConfig();
		const faviconLink = nuxtConfig.app?.head?.link?.find((item) => item.href === "/favicon.svg");

		expect(faviconLink).toEqual({
			rel: "icon",
			type: "image/svg+xml",
			href: "/favicon.svg",
		});
	});

	test("keeps the favicon as an abstract component-grid badge", async () => {
		const svg = await readFile(resolve(process.cwd(), "public/favicon.svg"), "utf8");

		expect(svg).toContain('viewBox="0 0 64 64"');
		expect(svg).toContain('aria-label="Vue Element CUI component grid badge"');
		expect(svg.match(/class="module"/g)).toHaveLength(4);
		expect(svg).toContain("#0F172A");
		expect(svg).toContain("#38BDF8");
		expect(svg).toContain("#42B883");
		expect(svg).not.toMatch(/>[^<]*(VEC|CUI|FN)[^<]*</);
	});
});
