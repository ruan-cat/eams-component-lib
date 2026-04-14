import { afterEach, describe, expect, test, vi } from "vitest";

type DocsLink = {
	title?: string;
	to: string;
};

type DocsConfig = {
	shadcnDocs: {
		header: {
			nav: DocsLink[];
			links: DocsLink[];
		};
		footer: {
			links: DocsLink[];
		};
		toc: {
			links: DocsLink[];
		};
	};
};

const loadAppConfig = async () => {
	vi.resetModules();
	vi.stubGlobal("defineAppConfig", <T>(config: T) => config);

	const module = await import("../../app.config.ts");

	return module.default as DocsConfig;
};

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("app.config header navigation", () => {
	test("keeps four fixed top-level nav routes matching content IA", async () => {
		const appConfig = await loadAppConfig();
		const routes = appConfig.shadcnDocs.header.nav.map((item) => item.to);

		expect(routes).toEqual(["/getting-started", "/components", "/guidelines", "/updates"]);
	});

	test("uses the current repository url for github entry points", async () => {
		const appConfig = await loadAppConfig();
		const repositoryUrl = "https://github.com/ruan-cat/eams-component-lib";

		expect(appConfig.shadcnDocs.header.links[0]?.to).toBe(repositoryUrl);
		expect(appConfig.shadcnDocs.footer.links[0]?.to).toBe(repositoryUrl);
		expect(appConfig.shadcnDocs.toc.links[0]?.to).toBe(repositoryUrl);
		expect(appConfig.shadcnDocs.toc.links[1]?.to).toBe(`${repositoryUrl}/issues`);
	});
});
