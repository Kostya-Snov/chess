import { createLogger, format, transports } from "winston";
import { WebSocketServer } from "ws";
import { run } from "./run";
import "dotenv/config";


const debugFilePath = process.env["DEBUG_FILE_PATH"];

const logger = createLogger({
    level: "debug",
    format: format.json({
        space: 4
    }),
    transports: debugFilePath === undefined
        ? new transports.Console()
        : new transports.File({
            filename: debugFilePath
        })
});


const server = new WebSocketServer({
    host: process.env["SERVER_HOST"],
    port: Number(process.env["SERVER_PORT"] ?? "3001")
});


run(server, logger);
