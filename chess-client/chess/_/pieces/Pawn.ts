import { type BoardCoordinate, getX, getY } from "../../BoardCoordinate";
import { getIndex } from "../../BoardIndex";
import { enPassantHandlerInstance, pawnFirstMovementHandlerInstance } from "../moves";
import { AddMovesQuery } from "./AddMovesQuery";
import { CanAttackQuery } from "./CanAttackQuery";
import { getOneWayMovePatterns, type MovePattern } from "./MovePattern";
import { Piece, PieceType } from "./Piece";


type Patterns = {
    readonly movement: readonly MovePattern[];
    readonly attack: readonly MovePattern[];
};
const blackPatterns: Patterns = {
    movement: getOneWayMovePatterns([
        [0, -1]
    ]),
    attack: getOneWayMovePatterns([
        [1, -1],
        [-1, -1],
    ])
};
const whitePatterns: Patterns = {
    movement: getOneWayMovePatterns([
        [0, 1]
    ]),
    attack: getOneWayMovePatterns([
        [-1, 1],
        [1, 1],
    ])
};

/** @sealed */
export class Pawn extends Piece {
    public override get type(): PieceType.Pawn {
        return PieceType.Pawn;
    }


    private get patterns(): Patterns {
        return this.isBlack ? blackPatterns : whitePatterns;
    }


    public override addMoves(query: AddMovesQuery): void {
        const { patterns } = this;
        query.addBase(patterns.movement, patterns.attack);

        const { fromX, fromY, state } = query;
        const { board } = state;
        if (!this.isMoved) {
            const [, dy] = patterns.movement[0]!;
            const passageIndex = getIndex(fromX, fromY + dy as BoardCoordinate);
            const to = getIndex(fromX, fromY + 2 * dy as BoardCoordinate);
            if (board[passageIndex] === undefined && board[to] === undefined) {
                query.tryAdd(pawnFirstMovementHandlerInstance, to);
            }
        }

        const enemyPawnIndex = state.doubleMovementPawnIndex;
        if (enemyPawnIndex === null) {
            return;
        }

        const enemyPawnX = getX(enemyPawnIndex);
        const enemyPawnY = getY(enemyPawnIndex);
        if (!(fromY === enemyPawnY && Math.abs(fromX - enemyPawnX) === 1)) {
            return;
        }

        const to = getIndex(
            enemyPawnX,
            enemyPawnY + (this.isBlack ? -1 : 1) as BoardCoordinate
        );
        query.tryAdd(enPassantHandlerInstance, to);
    }


    public override canAttack(query: CanAttackQuery): boolean {
        return query.getDefault(this.patterns.attack);
    }


    protected override with(isMoved: boolean): Piece {
        return this.defaultWith(Pawn, isMoved);
    }
}
