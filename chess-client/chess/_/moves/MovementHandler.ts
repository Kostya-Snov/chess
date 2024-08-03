import type { BoardIndex } from "../../BoardIndex";
import { ChessStateDraft } from "../ChessStateDraft";
import { type MoveHandler, MoveType } from "./MoveHandler";


let instance: MovementHandler;

export class MovementHandler implements MoveHandler {
    static {
        instance = new MovementHandler();
    }


    protected constructor() {
    }


    public get type(): MoveType.Movement {
        return MoveType.Movement;
    }


    /** @virtual */
    public apply(from: BoardIndex, to: BoardIndex, { board }: ChessStateDraft): void {
        board[to] = board[from]!.asMoved();
        board[from] = undefined;
    }
}

export const movementHandlerInstance = instance;
