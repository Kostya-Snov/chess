import { BoardIndex } from "../BoardIndex";
import { getMoveOneWayPatterns, type MovePattern } from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] = getMoveOneWayPatterns([
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1]
]);

/** @sealed */
export class Knight extends Piece {
    public override get type(): PieceType.Knight {
        return PieceType.Knight;
    }


    public override canAttack(index: BoardIndex): boolean {
        return this.defaultCanAttack(index, patterns);
    }


    protected override setMoves(): void {
        return this.baseSetMoves(patterns);
    }
}
