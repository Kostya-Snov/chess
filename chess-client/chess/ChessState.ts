import { ChessState } from "./_/ChessState";
import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from "./_/pieces";
import { ChessConstants } from "./ChessConstants";


export type { ChessState };


const initialBoard = (() => {
    const board: (Piece | undefined)[] = [];
    let id = 0;
    let isBlack: boolean;

    const addPiece = (PieceConstructor: new (id: number, isBlack: boolean) => Piece): void => {
        board.push(new PieceConstructor(id++, isBlack));
    }

    const addFiguresRank = (): void => {
        addPiece(Rook);
        addPiece(Knight);
        addPiece(Bishop);
        addPiece(King);
        addPiece(Queen);
        addPiece(Bishop);
        addPiece(Knight);
        addPiece(Rook);
    }

    const addPawnsRank = (): void => {
        for (let i = 0; i !== ChessConstants.BoardSize; ++i) {
            addPiece(Pawn);
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

export const initialChessState = new ChessState(initialBoard, false, null);
