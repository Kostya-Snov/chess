import { BoardIndex } from "../BoardIndex";
import {
    diagonalDirections,
    getMoveOneWayPatterns,
    type MovePattern,
    straightDirections
} from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] =
    getMoveOneWayPatterns([...straightDirections, ...diagonalDirections]);

/** @sealed */
export class King extends Piece {
    public override get type(): PieceType.King {
        return PieceType.King;
    }


    public override canAttack(index: BoardIndex): boolean {
        return this.defaultCanAttack(index, patterns);
    }


    protected override setMoves(): void {
        this.baseSetMoves(patterns);
    }
}
