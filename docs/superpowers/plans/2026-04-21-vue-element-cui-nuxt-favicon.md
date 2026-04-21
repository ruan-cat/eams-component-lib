# Vue Element CUI Nuxt Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-ready SVG favicon for the Vue Element CUI Nuxt documentation site and explicitly declare it in Nuxt head.

**Architecture:** Keep the change local to the documentation site package. The favicon is a static SVG under `public/`, Nuxt declares it through `app.head.link`, and a Vitest file verifies both the asset and the config contract.

**Tech Stack:** Nuxt 3, SVG, TypeScript, Vitest, PowerShell, pnpm.

---

## File Structure

- Create: `packages/vue-element-cui-nuxt/public/favicon.svg` — static browser favicon asset.
- Create: `packages/vue-element-cui-nuxt/tests/site/favicon-config.test.ts` — tests that the SVG exists, has the approved visual contract, and is declared in Nuxt head.
- Modify: `packages/vue-element-cui-nuxt/nuxt.config.ts` — add `app.head.link` for `/favicon.svg` without changing deployment-sensitive Nitro or SSR settings.

---

### Task 1: Add Favicon Coverage

**Files:**

- Create: `packages/vue-element-cui-nuxt/tests/site/favicon-config.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm --dir packages/vue-element-cui-nuxt test -- tests/site/favicon-config.test.ts
```

Expected: FAIL because `public/favicon.svg` does not exist and `nuxt.config.ts` does not declare `/favicon.svg`.

- [ ] **Step 3: Commit the failing test if using task-by-task commits**

```bash
git add packages/vue-element-cui-nuxt/tests/site/favicon-config.test.ts
git commit -m "🧪 test: 覆盖文档站 favicon 配置"
```

---

### Task 2: Implement the Favicon Asset and Head Link

**Files:**

- Create: `packages/vue-element-cui-nuxt/public/favicon.svg`
- Modify: `packages/vue-element-cui-nuxt/nuxt.config.ts`

- [ ] **Step 1: Add the static SVG asset**

Create `packages/vue-element-cui-nuxt/public/favicon.svg`:

```svg
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" role="img" aria-label="Vue Element CUI component grid badge" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="56" height="56" rx="15" fill="#0F172A"/>
  <path d="M25 20H39M25 44H39M20 25V39M44 25V39" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
  <rect class="module" x="14" y="14" width="17" height="17" rx="5" fill="#E0F2FE"/>
  <rect class="module" x="33" y="14" width="17" height="17" rx="5" fill="#BAE6FD"/>
  <rect class="module" x="14" y="33" width="17" height="17" rx="5" fill="#7DD3FC"/>
  <rect class="module" x="33" y="33" width="17" height="17" rx="5" fill="#38BDF8"/>
  <circle cx="41.5" cy="22.5" r="4.5" fill="#42B883"/>
  <path d="M19 20.5H26M19 25.5H24" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
  <path d="M19 39.5H26M19 44.5H24" stroke="#0F172A" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
  <path d="M38 39.5H45M38 44.5H43" stroke="#0F172A" stroke-width="2" stroke-linecap="round" opacity="0.78"/>
</svg>
```

- [ ] **Step 2: Add Nuxt head declaration**

In `packages/vue-element-cui-nuxt/nuxt.config.ts`, add `app.head.link` near the top-level site settings, after `devtools`:

```ts
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
```

- [ ] **Step 3: Run focused test to verify it passes**

Run:

```bash
pnpm --dir packages/vue-element-cui-nuxt test -- tests/site/favicon-config.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit the implementation if using task-by-task commits**

```bash
git add packages/vue-element-cui-nuxt/public/favicon.svg packages/vue-element-cui-nuxt/nuxt.config.ts
git commit -m "🐞 fix: 补齐文档站 favicon"
```

---

### Task 3: Verify the Documentation Site

**Files:**

- Verify: `packages/vue-element-cui-nuxt/public/favicon.svg`
- Verify: `packages/vue-element-cui-nuxt/nuxt.config.ts`
- Verify: `packages/vue-element-cui-nuxt/tests/site/favicon-config.test.ts`

- [ ] **Step 1: Run all Nuxt package tests**

Run:

```bash
pnpm --dir packages/vue-element-cui-nuxt test
```

Expected: PASS.

- [ ] **Step 2: Build the Nuxt documentation site**

Run:

```bash
pnpm --dir packages/vue-element-cui-nuxt build
```

Expected: PASS. The build should not require changing `nitro.externals`, `vite.ssr.noExternal`, or Vercel trace settings.

- [ ] **Step 3: Inspect the final diff**

Run:

```bash
git diff --stat
git diff -- packages/vue-element-cui-nuxt/public/favicon.svg packages/vue-element-cui-nuxt/nuxt.config.ts packages/vue-element-cui-nuxt/tests/site/favicon-config.test.ts
```

Expected: only the favicon asset, Nuxt head declaration, and favicon tests changed.

- [ ] **Step 4: Commit final verification changes if commits were not created per task**

```bash
git add packages/vue-element-cui-nuxt/public/favicon.svg packages/vue-element-cui-nuxt/nuxt.config.ts packages/vue-element-cui-nuxt/tests/site/favicon-config.test.ts
git commit -m "🐞 fix: 补齐文档站 favicon"
```

---

## Self-Review

- Spec coverage: the plan creates `public/favicon.svg`, declares it in Nuxt head, preserves existing logos, avoids text in the icon, and verifies the production failure mode.
- Marker scan: no incomplete implementation steps remain.
- Type consistency: `HeadLink`, `DocsNuxtConfig`, `/favicon.svg`, `image/svg+xml`, and `class="module"` are used consistently across tests and implementation.
