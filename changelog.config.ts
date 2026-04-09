import type { ChangelogConfig } from "changelogen";
import { changelogogenUseTypes } from "@ruan-cat/commitlint-config";

const relizyCompatibleTypes = changelogogenUseTypes as NonNullable<
	Parameters<typeof import("relizy").defineConfig>[0]["types"]
>;

export default {
	output: "CHANGELOG.md",
	types: relizyCompatibleTypes,
	templates: {
		commitMessage: "📦 release: publish component library showcase v{{newVersion}}",
	},
} satisfies Partial<ChangelogConfig>;
