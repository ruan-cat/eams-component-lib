import { defineConfig } from "relizy";

import changelogConfig from "./changelog.config.ts";

export default defineConfig({
	projectName: "eams-component-lib",

	types: changelogConfig.types,
	templates: {
		...(changelogConfig.templates ?? {}),
		changelogTitle: "{{newVersion}} ({{date}})",
	},

	monorepo: {
		versionMode: "independent",
		packages: ["packages/vue-element-cui"],
	},

	changelog: {
		rootChangelog: true,
		includeCommitBody: true,
		formatCmd: "pnpm run format:changelog",
	},

	release: {
		changelog: true,
		commit: true,
		push: true,
		gitTag: true,
		clean: true,
		noVerify: false,
		publish: false,
		providerRelease: false,
		social: false,
		prComment: false,
	},
});
