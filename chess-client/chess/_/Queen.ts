import { BoardIndex } from "../BoardIndex";
import {
    diagonalDirections,
    getMoveInfinityPatterns,
    type MovePattern,
    straightDirections
} from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] =
    getMoveInfinityPatterns([...straightDirections, ...diagonalDirections]);

/** @sealed */
export class Queen extends Piece {
    public override get type(): PieceType.Queen {
        return PieceType.Queen;
    }


    public override canAttack(index: BoardIndex): boolean {
        return this.defaultCanAttack(index, patterns);
    }


    protected override setMoves(): void {
        this.baseSetMoves(patterns);
    }
}
