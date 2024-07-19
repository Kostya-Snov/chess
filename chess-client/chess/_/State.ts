import { createArray } from "@/utils/createArray";
import { ChessConstants } from "../ChessConstants";
import { Bishop, King, Knight, Pawn, type Piece, Queen, Rook } from "./Piece";


const enum Constants {
    NumberFiguresAndPawnsRanks = 4
}

const emptyRanks: readonly undefined[] = createArray(
    ChessConstants.BoardSize * (ChessConstants.BoardSize - Constants.NumberFiguresAndPawnsRanks),
    () => undefined
);

export class State {
    public newPieceId = 0;
    public readonly board: (Piece | undefined)[] = [
        ...this.getFiguresRank(false),
        ...this.getPawnsRank(false),
        ...emptyRanks,
        ...this.getPawnsRank(true),
        ...this.getFiguresRank(true)
    ];


    public createPiece<T extends Piece>(
        Constructor: new (isBlack: boolean, id: number) => T,
        isBlack: boolean
    ): T {
        return new Constructor(isBlack, this.newPieceId++);
    }


    private getFiguresRank(isBlack: boolean): Piece[] {
        return [
            this.createPiece(Rook, isBlack),
            this.createPiece(Knight, isBlack),
            this.createPiece(Bishop, isBlack),
            this.createPiece(King, isBlack),
            this.createPiece(Queen, isBlack),
            this.createPiece(Bishop, isBlack),
            this.createPiece(Knight, isBlack),
            this.createPiece(Rook, isBlack)
        ];
    }


    private getPawnsRank(isBlack: boolean): Pawn[] {
        return createArray(ChessConstants.BoardSize, () => this.createPiece(Pawn, isBlack));
    }
}
