import type { BoardIndex } from "../BoardIndex";
import { getMoveOneWayPatterns, type MovePattern } from "./MovePattern";
import { Piece, PieceType } from "./Piece";


type PawnPatterns = {
    readonly defaultMovement: readonly MovePattern[];
    readonly firstMovement: readonly MovePattern[];
    readonly attack: readonly MovePattern[];
};
const blackPatterns: PawnPatterns = {
    defaultMovement: getMoveOneWayPatterns([
        [0, -1]
    ]),
    firstMovement: getMoveOneWayPatterns([
        [0, -1],
        [0, -2]
    ]),
    attack: getMoveOneWayPatterns([
        [1, -1],
        [-1, -1],
    ])
};
const whitePatterns: PawnPatterns = {
    defaultMovement: getMoveOneWayPatterns([
        [0, 1]
    ]),
    firstMovement: getMoveOneWayPatterns([
        [0, 1],
        [0, 2]
    ]),
    attack: getMoveOneWayPatterns([
        [-1, 1],
        [1, 1],
    ])
};

/** @sealed */
export class Pawn extends Piece {
    public override get type(): PieceType.Pawn {
        return PieceType.Pawn;
    }


    private get patterns(): PawnPatterns {
        return this.isBlack ? blackPatterns : whitePatterns;
    }


    public override canAttack(index: BoardIndex): boolean {
        return this.defaultCanAttack(index, this.patterns.attack);
    }


    protected override setMoves(): void {
        const { patterns } = this;
        this.baseSetMoves(
            this.isMoved ? patterns.defaultMovement : patterns.firstMovement,
            patterns.attack
        );
    }
}
