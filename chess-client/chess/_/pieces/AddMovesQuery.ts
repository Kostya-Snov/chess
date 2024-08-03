import { type BoardCoordinate, getX, getY } from "../../BoardCoordinate";
import type { BoardIndex } from "../../BoardIndex";
import type { ChessState } from "../ChessState";
import {
    attackHandlerInstance,
    ChessStateDraft,
    Move,
    MoveHandler,
    movementHandlerInstance
} from "../moves";
import { getMovePatternIndices, type MovePattern } from "./MovePattern";
import type { Piece } from "./Piece";


export class AddMovesQuery {
    public readonly moves = new Map<BoardIndex, Move>();


    public constructor(
        public readonly from: BoardIndex,
        public readonly state: ChessState
    ) {
    }


    public get fromX(): BoardCoordinate {
        return getX(this.from);
    }


    public get fromY(): BoardCoordinate {
        return getY(this.from);
    }


    public get fromPiece(): Piece {
        return this.state.board[this.from]!;
    }


    public tryAdd(handler: MoveHandler, to: BoardIndex): void {
        const { from, state } = this;

        const draft = new ChessStateDraft(state);
        draft.doubleMovementPawnIndex = null;
        handler.apply(from, to, draft);
        if (!draft.getState().isShah()) {
            draft.isBlacksTurn = !draft.isBlacksTurn;
            this.moves.set(to, {
                type: handler.type,
                from,
                to,
                previousState: state,
                state: draft.getState()
            });
        }
    }


    public addBase(
        movementPatterns: Iterable<MovePattern>,
        attackPatterns = movementPatterns
    ): void {
        const { fromX, fromY, fromPiece, state } = this;
        const { board } = state;

        for (const pattern of movementPatterns) {
            for (const to of getMovePatternIndices(fromX, fromY, pattern)) {
                if (board[to] !== undefined) {
                    break;
                }

                this.tryAdd(movementHandlerInstance, to);
            }
        }

        for (const pattern of attackPatterns) {
            for (const to of getMovePatternIndices(fromX, fromY, pattern)) {
                const toPiece = board[to];
                if (toPiece === undefined) {
                    continue;
                }

                if (fromPiece.isEnemy(toPiece)) {
                    this.tryAdd(attackHandlerInstance, to);
                }
                break;
            }
        }
    }
}
