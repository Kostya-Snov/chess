import { type BoardIndex, getX, getY, type Move, MoveType, PieceType } from "chess-engine";
import { CSSModuleClasses } from "chess-utils";
import { type FC, Fragment, type ReactNode } from "react";
import uncheckedClasses from "../History.module.scss";
import { Panel } from "./Panel";


const classes = new CSSModuleClasses(uncheckedClasses);


const blackPieceSymbols = {
    [PieceType.Pawn]: "♟",
    [PieceType.Rook]: "♜",
    [PieceType.Knight]: "♞",
    [PieceType.Bishop]: "♝",
    [PieceType.King]: "♚",
    [PieceType.Queen]: "♛"
} as const;

const whitePieceSymbols = {
    [PieceType.Pawn]: "♙",
    [PieceType.Rook]: "♖",
    [PieceType.Knight]: "♘",
    [PieceType.Bishop]: "♗",
    [PieceType.King]: "♔",
    [PieceType.Queen]: "♕"
} as const;

const getIndexName = (index: BoardIndex) =>
    String.fromCharCode("h".charCodeAt(0) - getX(index)) + (getY(index) + 1);

type GetMoveName = (move: Move) => string;

const getMovementOrAttackName: GetMoveName = ({ type, from, to, previousState, state }) => {
    const pieceSymbols = previousState.isBlacksTurn ? blackPieceSymbols : whitePieceSymbols;

    let result = "";

    const fromPieceType = previousState.board[from]!.type;
    if (fromPieceType !== PieceType.Pawn) {
        result += pieceSymbols[fromPieceType];
    }

    result +=
        getIndexName(from)
        + (type === MoveType.Movement ? "-" : "x")
        + getIndexName(to);

    const toPieceType = state.board[to]!.type;
    if (fromPieceType === PieceType.Pawn && toPieceType !== PieceType.Pawn) {
        result += pieceSymbols[toPieceType];
    }

    return result;
};

const moveNameGetters: Readonly<Record<MoveType, GetMoveName>> = {
    [MoveType.Movement]: getMovementOrAttackName,

    [MoveType.Attack]: getMovementOrAttackName,

    [MoveType.EnPassant]: ({ from, to }) => getIndexName(from) + "x" + getIndexName(to) + "e.p.",

    [MoveType.Castling]: ({ from, to }) => from < to ? "0-0-0" : "0-0"
};

export const getMoveName: GetMoveName = move => {
    const { state } = move;
    return (
        moveNameGetters[move.type](move)
        + (
            state.canMove()
                ? state.isShah() ? "+" : ""
                : state.isShah() ? "#" : "="
        )
    );
};


export type HistoryProps = {
    readonly history: readonly Move[];
    readonly historyIndex: number;
    readonly onItemClick: (index: number) => void;
};

export const History: FC<HistoryProps> = ({ history, historyIndex, onItemClick }) => {
    const renderItem = (classId: string, index: number, text: string): ReactNode => {
        const isSelected = historyIndex === index;
        return (
            <button
                className={classes.build().add(classId).addIf(isSelected, "selected").class}
                onClick={
                    isSelected
                        ? undefined
                        : () => onItemClick(index)
                }
            >
                {text}
            </button>
        );
    };

    return (
        <Panel>
            <h2>Історія</h2>
            <div className={classes.get("items")}>
                {renderItem("start", -1, "Початок")}
                {history.map((move, index) => (
                    <Fragment key={index}>
                        {
                            index % 2 === 0
                                ? <span>{Math.floor(index / 2) + 1}.</span>
                                : null
                        }
                        {renderItem("item", index, getMoveName(move))}
                    </Fragment>
                ))}
            </div>
        </Panel>
    );
};
