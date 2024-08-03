import { AddMovesQuery } from "./AddMovesQuery";
import { CanAttackQuery } from "./CanAttackQuery";
import { getInfinityMovePatterns, type MovePattern, straightDirections } from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] = getInfinityMovePatterns(straightDirections);

/** @sealed */
export class Rook extends Piece {
    public override get type(): PieceType.Rook {
        return PieceType.Rook;
    }


    public override addMoves(query: AddMovesQuery): void {
        query.addBase(patterns);
    }


    public override canAttack(query: CanAttackQuery): boolean {
        return query.getDefault(patterns);
    }


    protected override with(isMoved: boolean): Piece {
        return this.defaultWith(Rook, isMoved);
    }
}
