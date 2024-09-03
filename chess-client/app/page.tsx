"use client";

import { Chess, initialChessComponentState } from "@/components/Chess";
import { ChessContainer } from "@/components/ChessContainer";
import { Modal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { assert, CSSModuleClasses } from "chess-utils";
import { type FC, useEffect, useRef, useState } from "react";
import uncheckedClasses from "./_/page.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const serverUrl = process.env["NEXT_PUBLIC_SERVER_URL"];
assert(serverUrl !== undefined);


const RootPage: FC = () => {
    const socketRef = useRef<WebSocket>();
    const [chessComponentState, setChessComponentState] = useState(initialChessComponentState);
    const [playerIsBlack, setPlayerIsBlack] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent): void => {
            const data: unknown = event.data;
            assert(typeof data === "string");
            const response: unknown = JSON.parse(data);

            if (typeof response === "boolean") {
                setPlayerIsBlack(response);
            } else {
                assert(false);
            }
        };

        const cleanup = (): void => {
            const socket = socketRef.current;
            assert(socket !== undefined);

            socket.close();
            createSocket();
            setChessComponentState(initialChessComponentState);
            setPlayerIsBlack(null);
            setIsLoading(false);
        };

        const handleError = () => setHasError(true);

        const createSocket = (): void => {
            const socket = socketRef.current = new WebSocket(serverUrl);
            socket.addEventListener("message", handleMessage);
            socket.addEventListener("close", cleanup);
            socket.addEventListener("error", handleError);
        };

        createSocket();
        return () => {
            const socket = socketRef.current;
            assert(socket !== undefined);

            socket.removeEventListener("close", cleanup);
            switch (socket.readyState) {
                case WebSocket.CONNECTING:
                    socket.addEventListener("open", () => socket.close());
                    break;
                case WebSocket.OPEN:
                    socket.close();
                    break;
            }
        };
    }, []);

    const isWaitingOpponent = playerIsBlack === null;
    const { chessState } = chessComponentState.lastInHistory;

    return (
        <>
            <ChessContainer>
                <div className={classes.get("chessWrapper")}>
                    <h2 className={classes.get("stateTitle")}>
                        {
                            isWaitingOpponent
                                ? "Очікування опонента..."
                                : isLoading
                                    ? "Завантаження..."
                                    : chessState.isBlacksTurn === playerIsBlack
                                        ? `Твій хід (${playerIsBlack ? "чорні" : "білі"})`
                                        : "Хід опонента"
                        }
                    </h2>
                    <Chess
                        state={chessComponentState}
                        setState={setChessComponentState}
                        boardIsBlocked={
                            isLoading
                            || (
                                chessComponentState.history.length
                                !== chessComponentState.historyIndex + 1
                            )
                            || chessComponentState.chessState.isBlacksTurn !== playerIsBlack
                        }
                    />
                    <Modal isOpen={isWaitingOpponent || hasError}>
                        {
                            hasError
                                ? (
                                    <h2 className={classes.get("errorTitle")}>
                                        Сталась помилка!
                                    </h2>
                                )
                                : (
                                    <h2 className={classes.get("waitingTitle")}>
                                        Очікування опонента...
                                    </h2>
                                )
                        }
                    </Modal>
                </div>
            </ChessContainer>
            <Spinner
                className={
                    classes.build()
                        .add("spinner")
                        .addIf(isWaitingOpponent || isLoading, "visible")
                        .class
                }
            />
        </>
    );
};


export default RootPage;
