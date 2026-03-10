import js from "@eslint/js";
import globals from "globals";

export default [
	{
		ignores: ["node_modules/**", "public/**"],
	},
	js.configs.recommended,
	{
		files: ["source/js/**/*.js"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "script",
			globals: {
				...globals.browser,
				$: "readonly",
				jQuery: "readonly",
				Fancybox: "readonly",
				Inputmask: "readonly",
				Swiper: "readonly",
			},
		},
		rules: {},
	},
];
