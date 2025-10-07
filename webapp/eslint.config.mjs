import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const options =  [{
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}, ...compat.extends("next/core-web-vitals", "prettier"), {
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        curly: ["error", "all"],
        "@next/next/no-html-link-for-pages": "off",
    },
}]

export default options;