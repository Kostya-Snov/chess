import { initialChessState } from "chess-engine";
import { assert } from "chess-utils";
import { type Logger } from "winston";
import { type AddressInfo, type WebSocket, type WebSocketServer } from "ws";
import { asErrorResponse, successGameResponse } from "./GameResponse";
import { Player } from "./Player";


type AddListenersOptions = {
    readonly socket: WebSocket;
    readonly logger: Logger;
    readonly handle: (request: unknown, logger: Logger) => void;
    readonly cleanup: () => void;
};

const addListeners = ({ socket, logger, handle, cleanup }: AddListenersOptions): void => {
    socket
        .on("message", data => {
            const messageLogger = logger.child({
                messageId: crypto.randomUUID()
            });

            messageLogger.debug("A message received.", { data });

            let request: unknown;
            const dataString = data.toString();
            try {
                request = JSON.parse(dataString);
            } catch (error) {
                messageLogger.debug("A parsing error occurred.", { error });
                socket.send(JSON.stringify(asErrorResponse("Invalid JSON.", error)));
                return;
            }

            messageLogger.debug("A request parsed.", { request });
            handle(request, messageLogger);
        })
        .on("close", (code, reason) => {
            logger.debug("The socket closed.", { code, reason });
            cleanup();
        })
        .on("error", error => {
            logger.error("An error occurred in the socket.", { error });
            cleanup();
        });
};


const isAddressInfoInSocket = (value: {}): value is AddressInfo => "port" in value;


type WaitingPlayer = {
    readonly socket: WebSocket;
    readonly address: AddressInfo;
};

class Runner {
    private waitingPlayer: WaitingPlayer | null = null;


    public constructor(
        private readonly server: WebSocketServer,
        private readonly logger: Logger
    ) {
    }


    public run(): void {
        const { server, logger } = this;

        server
            .on("connection", (socket, request) => {
                const address = request.socket.address();
                assert(isAddressInfoInSocket(address));
                logger.debug("A socket accepted.", { address });

                if (this.waitingPlayer === null) {
                    this.setWaitingPlayer(socket, address);
                } else {
                    this.createGame(socket, address);
                }
            })
            .on("close", () => logger.debug("The server closed."))
            .on("error", error => {
                logger.error("An error occurred in the server.", { error });
                server.close();
            });

        logger.debug("The server started.");
    }


    private setWaitingPlayer(socket: WebSocket, address: AddressInfo): void {
        const logger = this.logger.child({
            waitingPlayerId: crypto.randomUUID()
        });

        addListeners({
            socket,
            logger,
            cleanup: () => {
                this.waitingPlayer = null;
                logger.debug("The waiting player cleared.");
            },
            handle: (_, logger) => {
                socket.send(JSON.stringify(asErrorResponse("The player is waiting.")));
                logger.debug("A message sent to the waiting player.");
            }
        });

        this.waitingPlayer = { socket, address };
        logger.debug("A waiting player is set.", { address });
    }


    private createGame(acceptedSocket: WebSocket, acceptedAddress: AddressInfo): void {
        const { waitingPlayer } = this;
        assert(waitingPlayer !== null);
        const waitingPlayerSocket = waitingPlayer.socket;
        const waitingPlayerAddress = waitingPlayer.address;
        this.waitingPlayer = null;
        waitingPlayerSocket.removeAllListeners();

        const otherPlayerSocket = acceptedSocket;
        const otherPlayerAddress = acceptedAddress;

        const logger = this.logger.child({
            gameId: crypto.randomUUID()
        });

        let gameIsClosed = false;
        const cleanup = (): void => {
            if (gameIsClosed) {
                return;
            }

            for (const socket of [waitingPlayerSocket, otherPlayerSocket]) {
                socket.close();
            }
            gameIsClosed = true;
            logger.debug("The game closed.");
        };

        const game = {
            state: initialChessState
        };
        const waitingPlayerIsBlack = Math.random() < 0.5;
        for (const isBlack of [false, true]) {
            const playerLogger = logger.child({
                player: isBlack ? "black" : "white"
            });

            const [playerSocket, opponentSocket] = isBlack === waitingPlayerIsBlack
                ? [waitingPlayerSocket, otherPlayerSocket]
                : [otherPlayerSocket, waitingPlayerSocket];
            playerSocket.send(JSON.stringify(isBlack));

            const player = new Player(game, isBlack);
            addListeners({
                socket: playerSocket,
                logger: playerLogger,
                cleanup,
                handle: (request, logger) => {
                    const response = player.handleRequest(request);
                    logger.debug("A response created.", { response });
                    playerSocket.send(JSON.stringify(response));

                    if (response === successGameResponse) {
                        opponentSocket.send(JSON.stringify(request));
                        logger.debug("The request duplicated for the opponent.");
                    } else {
                        logger.debug("The error response sent.");
                    }
                }
            });
        }

        logger.debug(
            "A game started.",
            waitingPlayerIsBlack
                ? {
                    blackPlayerAddress: waitingPlayerAddress,
                    whitePlayerAddress: otherPlayerAddress,
                    waitingPlayerColor: "black",
                    otherPlayerColor: "white"
                }
                : {
                    blackPlayerAddress: otherPlayerAddress,
                    whitePlayerAddress: waitingPlayerAddress,
                    waitingPlayerColor: "white",
                    otherPlayerColor: "black"
                }
        );
    }
}


export const run = (server: WebSocketServer, logger: Logger): void =>
    new Runner(server, logger).run();
