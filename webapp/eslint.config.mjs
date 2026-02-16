import nextPlugin from "eslint-config-next";

const options = [
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**"]
    },
    ...nextPlugin,
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
        },
        rules: {
            curly: ["error", "all"],
            "@next/next/no-html-link-for-pages": "off",
        },
    }
];

export default options;