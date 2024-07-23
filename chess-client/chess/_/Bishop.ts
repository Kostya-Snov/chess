import { BoardIndex } from "../BoardIndex";
import { diagonalDirections, getMoveInfinityPatterns, type MovePattern } from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] = getMoveInfinityPatterns(diagonalDirections);

/** @sealed */
export class Bishop extends Piece {
    public override get type(): PieceType.Bishop {
        return PieceType.Bishop;
    }


    public override canAttack(index: BoardIndex): boolean {
        return this.defaultCanAttack(index, patterns);
    }


    protected override setMoves(): void {
        return this.baseSetMoves(patterns);
    }
}
