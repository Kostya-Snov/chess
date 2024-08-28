import { type AddMovesQuery } from "./AddMovesQuery";
import { type CanAttackQuery } from "./CanAttackQuery";
import { getOneWayMovePatterns, type MovePattern } from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] = getOneWayMovePatterns([
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


    public override addMoves(query: AddMovesQuery): void {
        query.addBase(patterns);
    }


    public override canAttack(query: CanAttackQuery): boolean {
        return query.getDefault(patterns);
    }


    protected override with(isMoved: boolean): Piece {
        return this.defaultWith(Knight, isMoved);
    }
}
