import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";


const compat = new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
    resolvePluginsRelativeTo:
        dirname(fileURLToPath(import.meta.resolve("eslint-config-chess-legacy")))
});

export default [
    ...compat.extends("chess-legacy"),
    {
        files: ["**/*.ts"]
    }
];
