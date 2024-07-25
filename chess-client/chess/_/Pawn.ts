import { type BoardIndex, getIndex } from "../BoardIndex";
import { type BoardCoordinate, getX, getY } from "../BoardCoordinate";
import { type Direction, getMoveOneWayPatterns, type MovePattern } from "./MovePattern";
import { Piece, PieceType } from "./Piece";
import { Move, MovementMove, MoveType, type Rollback } from "./Move";


class FirstMovementMove extends MovementMove {
    protected override applyCore(): Rollback {
        this.state.doubleMovementPawnIndex = this.to;
        return super.applyCore();
    }
}


class EnPassantMove extends Move {
    /** @sealed */
    public override get type(): MoveType.EnPassant {
        return MoveType.EnPassant;
    }


    protected override applyCore(): Rollback {
        const { piece, from, to } = this;
        const enemyX = getX(to);
        const enemyY = getY(to) - (piece.isBlack ? -1 : 1) as BoardCoordinate;
        const enemyPiece = this.state.mutableBoard[getIndex(enemyX, enemyY)]!;

        piece.move(to);
        enemyPiece.delete();

        return () => {
            enemyPiece.restore();
            piece.move(from);
        };
    }
}


type PawnPatterns = {
    readonly defaultMovement: readonly MovePattern[];
    readonly firstMovement: Direction;
    readonly attack: readonly MovePattern[];
};
const blackPatterns: PawnPatterns = {
    defaultMovement: getMoveOneWayPatterns([
        [0, -1]
    ]),
    firstMovement: [0, -2],
    attack: getMoveOneWayPatterns([
        [1, -1],
        [-1, -1],
    ])
};
const whitePatterns: PawnPatterns = {
    defaultMovement: getMoveOneWayPatterns([
        [0, 1]
    ]),
    firstMovement: [0, 2],
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
        const { patterns, x, y } = this;
        this.baseSetMoves(patterns.defaultMovement, patterns.attack);
        if (!this.isMoved) {
            const [dx, dy] = patterns.firstMovement;
            const toX = x + dx as BoardCoordinate;
            const toY = y + dy as BoardCoordinate;
            this.trySetMove(FirstMovementMove, getIndex(toX, toY));
        } else {
            const enemyIndex = this.state.doubleMovementPawnIndex;
            if (enemyIndex === null) {
                return;
            }

            const enemyX = getX(enemyIndex);
            const enemyY = getY(enemyIndex);
            if (!(y === enemyY && Math.abs(x - enemyX) === 1)) {
                return;
            }

            const toX = enemyX;
            const toY = enemyY + (this.isBlack ? -1 : 1) as BoardCoordinate;
            this.trySetMove(EnPassantMove, getIndex(toX, toY));
        }
    }
}
