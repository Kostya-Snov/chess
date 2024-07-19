import { type BoardIndex, getIndex } from "../BoardIndex";
import { getX, getY, isBoardCoordinate } from "../BoardCoordinate";
import { PieceType } from "../PieceInfo";
import { AttackMoveHandler, type MoveHandler, MovementMoveHandler } from "./MoveHandler";
import type { State } from "./State";


abstract class Piece {
    public abstract readonly type: PieceType;
    public isMoved = false;


    public constructor(
        public readonly isBlack: boolean,
        public readonly id: number
    ) {
    }


    public abstract getMoves(index: BoardIndex, state: State): Map<BoardIndex, MoveHandler>;
}

export { type Piece };


type BoardVector = readonly [x: number, y: number];

const tryAddVector = (index: BoardIndex, [dx, dy]: BoardVector): BoardIndex | null => {
    const x = getX(index) + dx;
    if (!isBoardCoordinate(x)) {
        return null;
    }

    const y = getY(index) + dy;
    if (!isBoardCoordinate(y)) {
        return null;
    }

    return getIndex(x, y);
}

const enum MoveKind {
    Movement = 1,
    Attack = Movement << 1,
    MovementOrAttack = Movement | Attack
}

class MovesCalculator {
    public readonly moves = new Map<BoardIndex, MoveHandler>();


    public constructor(
        public readonly index: BoardIndex,
        public readonly state: State
    ) {
    }


    public add(
        direction: BoardVector,
        numberIterations: number,
        kind = MoveKind.MovementOrAttack
    ): this {
        const thisPiece = this.state.board[this.index]!;
        const needMovement = (kind & MoveKind.Movement) !== 0;
        const needAttack = (kind & MoveKind.Attack) !== 0;

        for (
            let i = 0, index = tryAddVector(this.index, direction);
            i !== numberIterations && index !== null;
            ++i, index = tryAddVector(index, direction)
        ) {
            const piece = this.state.board[index];
            if (piece !== undefined) {
                if (needAttack && thisPiece.isBlack !== piece.isBlack) {
                    this.moves.set(index, new AttackMoveHandler(this.index, index));
                }
                break;
            }
            if (needMovement) {
                this.moves.set(index, new MovementMoveHandler(this.index, index));
            }
        }

        return this;
    }


    public addMultiple(
        directions: Iterable<BoardVector>,
        numberIterations: number,
        kind = MoveKind.MovementOrAttack
    ): this {
        for (const direction of directions) {
            this.add(direction, numberIterations, kind);
        }
        return this;
    }
}

const straightDirections = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
] as const;

const diagonalDirections = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1]
] as const;


const pawnBlackDirections = {
    defaultMovement: [0, -1],
    firstMovement: [0, -2],
    attack: [
        [1, -1],
        [-1, -1],
    ]
} as const;
const pawnWhiteDirections = {
    defaultMovement: [0, 1],
    firstMovement: [0, 2],
    attack: [
        [-1, 1],
        [1, 1],
    ]
} as const;

export class Pawn extends Piece {
    /** @sealed */
    public override get type(): PieceType.Pawn {
        return PieceType.Pawn;
    }


    /** @sealed */
    public override getMoves(index: BoardIndex, state: State): Map<BoardIndex, MoveHandler> {
        const calculator = new MovesCalculator(index, state);

        const directions = this.isBlack ? pawnBlackDirections : pawnWhiteDirections;
        calculator.add(directions.defaultMovement, 1, MoveKind.Movement);
        if (!this.isMoved) {
            calculator.add(directions.firstMovement, 1, MoveKind.Movement);
        }
        calculator.addMultiple(directions.attack, 1, MoveKind.Attack);

        return calculator.moves;
    }
}


export class Rook extends Piece {
    /** @sealed */
    public override get type(): PieceType.Rook {
        return PieceType.Rook;
    }


    /** @sealed */
    public override getMoves(index: BoardIndex, state: State): Map<BoardIndex, MoveHandler> {
        return new MovesCalculator(index, state)
            .addMultiple(straightDirections, Number.MIN_SAFE_INTEGER)
            .moves;
    }
}


const knightDirections = [
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1]
] as const;

export class Knight extends Piece {
    /** @sealed */
    public override get type(): PieceType.Knight {
        return PieceType.Knight;
    }


    /** @sealed */
    public override getMoves(index: BoardIndex, state: State): Map<BoardIndex, MoveHandler> {
        return new MovesCalculator(index, state)
            .addMultiple(knightDirections, 1)
            .moves;
    }
}


export class Bishop extends Piece {
    /** @sealed */
    public override get type(): PieceType.Bishop {
        return PieceType.Bishop;
    }


    /** @sealed */
    public override getMoves(index: BoardIndex, state: State): Map<BoardIndex, MoveHandler> {
        return new MovesCalculator(index, state)
            .addMultiple(diagonalDirections, Number.MAX_SAFE_INTEGER)
            .moves;
    }
}


export class King extends Piece {
    /** @sealed */
    public override get type(): PieceType.King {
        return PieceType.King;
    }


    /** @sealed */
    public override getMoves(index: BoardIndex, state: State): Map<BoardIndex, MoveHandler> {
        return new MovesCalculator(index, state)
            .addMultiple(straightDirections, 1)
            .addMultiple(diagonalDirections, 1)
            .moves;
    }
}


export class Queen extends Piece {
    /** @sealed */
    public override get type(): PieceType.Queen {
        return PieceType.Queen;
    }


    /** @sealed */
    public override getMoves(index: BoardIndex, state: State): Map<BoardIndex, MoveHandler> {
        return new MovesCalculator(index, state)
            .addMultiple(straightDirections, Number.MAX_SAFE_INTEGER)
            .addMultiple(diagonalDirections, Number.MAX_SAFE_INTEGER)
            .moves;
    }
}
