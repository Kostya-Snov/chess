import { ChessState } from "./_/ChessState";
import { createPiece, type Piece, PieceType } from "./_/pieces";
import { ChessConstants } from "./ChessConstants";


export { type ChessState };


const initialBoard = (() => {
    const board: (Piece | undefined)[] = [];
    let id = 0;
    let isBlack: boolean;

    const addPiece = (type: PieceType): void => {
        board.push(createPiece(type, id++, isBlack, false));
    }

    const addFiguresRank = (): void => {
        addPiece(PieceType.Rook);
        addPiece(PieceType.Knight);
        addPiece(PieceType.Bishop);
        addPiece(PieceType.King);
        addPiece(PieceType.Queen);
        addPiece(PieceType.Bishop);
        addPiece(PieceType.Knight);
        addPiece(PieceType.Rook);
    }

    const addPawnsRank = (): void => {
        for (let i = 0; i !== ChessConstants.BoardSize; ++i) {
            addPiece(PieceType.Pawn);
        }
    }

    const addEmptyRanks = (): void => {
        const enum Constants {
            EmptyRanksLength = 4 * ChessConstants.BoardSize
        }

        for (let i = 0; i !== Constants.EmptyRanksLength; ++i) {
            board.push(undefined);
        }
    }

    isBlack = false;
    addFiguresRank();
    addPawnsRank();

    addEmptyRanks();

    isBlack = true;
    addPawnsRank();
    addFiguresRank();

    return board;
})();

export const initialChessState = new ChessState(initialBoard, [], false, null, null);
