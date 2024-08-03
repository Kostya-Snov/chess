import { type AddMovesQuery } from "./AddMovesQuery";
import { type CanAttackQuery } from "./CanAttackQuery";


export const enum PieceType {
    Pawn,
    Rook,
    Knight,
    Bishop,
    King,
    Queen
}


export abstract class Piece {
    public abstract readonly type: PieceType;


    public constructor(
        public readonly id: number,
        public readonly isBlack: boolean,
        public readonly isMoved: boolean
    ) {
    }


    public isEnemy(piece: Piece): boolean {
        return this.isBlack !== piece.isBlack;
    }


    /** @internal */
    public abstract addMoves(query: AddMovesQuery): void;


    /** @internal */
    public abstract canAttack(query: CanAttackQuery): boolean;


    /** @internal */
    public asMoved(): Piece {
        return this.with(true);
    }


    protected abstract with(isMoved: boolean): Piece; // Is also a brand.


    protected defaultWith(
        PieceConstructor: new (id: number, isBlack: boolean, isMoved: boolean) => Piece,
        isMoved: boolean
    ): Piece {
        return new PieceConstructor(this.id, this.isBlack, isMoved);
    }
}
