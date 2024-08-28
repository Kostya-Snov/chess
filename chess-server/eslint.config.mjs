import chessConfigs from "eslint-config-chess";


export default [
    ...chessConfigs,
    {
        ignores: ["dist/"]
    }
];
