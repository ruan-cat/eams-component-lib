import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

const sharedRules = {
	"no-console": "warn",
};

export default [
	{
		ignores: [
			"**/dist/**",
			"**/node_modules/**",
			"**/.turbo/**",
			"**/.nuxt/**",
			"**/.nitro/**",
			"**/.output/**",
			"**/coverage/**",
			"old/vue-element-cui/**",
		],
	},
	{
		files: ["**/*.{js,mjs,cjs}"],
		rules: {
			...sharedRules,
			"no-unused-vars": "warn",
		},
	},
	{
		files: ["**/*.{ts,tsx,mts,cts}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			...sharedRules,
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "warn",
		},
	},
	{
		files: ["**/*.vue"],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tseslint.parser,
				ecmaVersion: "latest",
				sourceType: "module",
				extraFileExtensions: [".vue"],
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			...sharedRules,
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "warn",
		},
	},
];
