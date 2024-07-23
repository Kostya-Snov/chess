import { BoardIndex } from "../BoardIndex";
import { getMoveInfinityPatterns, type MovePattern, straightDirections } from "./MovePattern";
import { Piece, PieceType } from "./Piece"


const patterns: readonly MovePattern[] = getMoveInfinityPatterns(straightDirections);

/** @sealed */
export class Rook extends Piece {
    public override get type(): PieceType.Rook {
        return PieceType.Rook;
    }


    public override canAttack(index: BoardIndex): boolean {
        return this.defaultCanAttack(index, patterns);
    }


    protected override setMoves(): void {
        this.baseSetMoves(patterns);
    }
}
