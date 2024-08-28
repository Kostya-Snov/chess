import { type BoardCoordinate, getX, getY } from "../BoardCoordinate";
import { type BoardIndex } from "../BoardIndex";
import { type ChessState } from "../ChessState";
import { ChessStateDraft } from "../ChessStateDraft";
import { attackHandlerInstance } from "../moves/AttackHandler";
import { type Move } from "../moves/Move";
import { type MoveHandler } from "../moves/MoveHandler";
import { movementHandlerInstance } from "../moves/MovementHandler";
import { getMovePatternIndices, type MovePattern } from "./MovePattern";
import { type Piece } from "./Piece";


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
        if (draft.getState().isShah()) {
            return;
        }

        if (draft.promotionIndex === null) {
            draft.isBlacksTurn = !draft.isBlacksTurn;
        } else {
            draft.cachedCanMove = true;
        }
        this.moves.set(to, {
            type: handler.type,
            from,
            to,
            previousState: state,
            state: draft.getState()
        });
    }


    public addBase(
        movementPatterns: Iterable<MovePattern>,
        attackPatterns = movementPatterns,
        movementHandler: MoveHandler = movementHandlerInstance,
        attackHandler: MoveHandler = attackHandlerInstance
    ): void {
        const { fromX, fromY, fromPiece, state } = this;
        const { board } = state;

        for (const pattern of movementPatterns) {
            for (const to of getMovePatternIndices(fromX, fromY, pattern)) {
                if (board[to] !== undefined) {
                    break;
                }

                this.tryAdd(movementHandler, to);
            }
        }

        for (const pattern of attackPatterns) {
            for (const to of getMovePatternIndices(fromX, fromY, pattern)) {
                const toPiece = board[to];
                if (toPiece === undefined) {
                    continue;
                }

                if (fromPiece.isEnemy(toPiece)) {
                    this.tryAdd(attackHandler, to);
                }
                break;
            }
        }
    }
}
