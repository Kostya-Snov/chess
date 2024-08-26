import { parser, plugin as typescriptEslintPlugin } from "typescript-eslint";
import stylisticEslintPlugin from "@stylistic/eslint-plugin";


export default [{
    languageOptions: {
        parser,
        parserOptions: {
            project: true
        }
    },
    files: ["**/*.ts"],
    plugins: {
        "@typescript-eslint": typescriptEslintPlugin,
        "@stylistic": stylisticEslintPlugin
    },
    rules: {
        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                fixStyle: "inline-type-imports"
            }
        ],
        "@typescript-eslint/consistent-type-exports": [
            "error",
            {
                fixMixedExportsWithInlineTypeSpecifier: true
            }
        ],
        "@stylistic/semi": "error"
    }
}];
