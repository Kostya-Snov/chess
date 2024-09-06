"use client";

import { Chess, type ChessComponentState, initialChessComponentState } from "@/components/Chess";
import { ChessContainer } from "@/components/ChessContainer";
import { Modal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { isBoardIndex, PieceType, type PromotionPieceType } from "chess-engine";
import { assert, CSSModuleClasses } from "chess-utils";
import { type FC, useEffect, useRef, useState } from "react";
import uncheckedClasses from "./OnlinePage.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const serverUrl = process.env["NEXT_PUBLIC_SERVER_URL"];
assert(serverUrl !== undefined);


const promotionPieceTypes: readonly number[] = [
    PieceType.Rook,
    PieceType.Knight,
    PieceType.Bishop,
    PieceType.Queen
] satisfies PromotionPieceType[];

const isPromotionPieceType = (value: number): value is PromotionPieceType =>
    promotionPieceTypes.includes(value);


export const OnlinePage: FC = () => {
    const socketRef = useRef<WebSocket>();
    const [chessComponentState, setChessComponentState] = useState(initialChessComponentState);
    const [playerIsBlack, setPlayerIsBlack] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        type ResponseHandler = (response: unknown) => boolean;

        const handleIdentificationResponse: ResponseHandler = response => {
            if (typeof response !== "boolean") {
                return false;
            }

            setPlayerIsBlack(response);
            return true;
        };

        const handleSuccessResponse: ResponseHandler = response => {
            if (response !== "Ok") {
                return false;
            }

            setIsLoading(false);
            return true;
        };

        const setCurrentState = (
            callback: (currentState: ChessComponentState) => ChessComponentState
        ) => setChessComponentState(prev => {
            const newState = callback(prev.lastInHistory);
            const previousHistoryIndex = prev.historyIndex;
            return newState.historyIndex === previousHistoryIndex + 1
                ? newState
                : newState.setHistoryIndex(previousHistoryIndex);
        });

        const handleMoveResponse: ResponseHandler = response => {
            if (!(
                typeof response === "object"
                && response !== null
                && "from" in response
                && "to" in response
            )) {
                return false;
            }
            const { from, to } = response;

            assert(
                typeof from === "number"
                && isBoardIndex(from)
                && typeof to === "number"
                && isBoardIndex(to)
            );

            setCurrentState(currentState => {
                const move = currentState.chessState.getMoves(from).get(to);
                assert(move !== undefined);
                return currentState.applyMove(move);
            });
            return true;
        };

        const handlePawnPromotionResponse: ResponseHandler = response => {
            if (typeof response !== "number") {
                return false;
            }
            const pieceType = response;
            assert(isPromotionPieceType(pieceType));
            setCurrentState(currentState => currentState.replaceInPromotion(pieceType));
            return true;
        };

        const responseHandlers: readonly ResponseHandler[] = [
            handleIdentificationResponse,
            handleSuccessResponse,
            handleMoveResponse,
            handlePawnPromotionResponse
        ];


        const handleMessage = (event: MessageEvent): void => {
            const data: unknown = event.data;
            assert(typeof data === "string");
            const response: unknown = JSON.parse(data);

            for (const handle of responseHandlers) {
                if (handle(response)) {
                    return;
                }
            }
            assert(false);
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

    const sendRequest = (request: unknown): void => {
        const socket = socketRef.current;
        assert(socket !== undefined);
        socket.send(JSON.stringify(request));
        setIsLoading(true);
    };

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
                        onMove={({ from, to }) => sendRequest({ from, to })}
                        onPromotionChoose={sendRequest}
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
