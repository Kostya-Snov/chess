import { getX, getY } from "@/chess/BoardCoordinate";
import { type BoardIndex } from "@/chess/BoardIndex";
import { type Move, MoveType } from "@/chess/Move";
import { PieceType } from "@/chess/Piece";


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


const getMovementOrAttackName = ({ type, from, to, previousState, state }: Move): string => {
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
}


const getMoveNameFunctions: Readonly<Record<MoveType, (move: Move) => string>> = {
    [MoveType.Movement]: getMovementOrAttackName,

    [MoveType.Attack]: getMovementOrAttackName,

    [MoveType.EnPassant]: ({ from, to }) => getIndexName(from) + "x" + getIndexName(to) + "e.p.",

    [MoveType.Castling]: ({ from, to }) => from < to ? "0-0-0" : "0-0"
};


export const getMoveName = (move: Move): string => {
    const { state } = move;
    return (
        getMoveNameFunctions[move.type](move)
        + (
            state.canMove()
                ? state.isShah()
                    ? "+"
                    : ""
                : state.isShah()
                    ? "#"
                    : "="
        )
    );
}
