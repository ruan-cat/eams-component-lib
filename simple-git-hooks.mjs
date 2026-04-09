export default {
	"commit-msg": "npx --no-install commitlint --edit ${1}",
	"pre-commit": "npx lint-staged",
};
