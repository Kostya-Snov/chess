import { type BoardIndex } from "../../BoardIndex";
import { type ChessStateDraft } from "../ChessStateDraft";
import { type MoveHandler, MoveType } from "./MoveHandler";


let instance: AttackHandler;

export class AttackHandler implements MoveHandler {
    static {
        instance = new AttackHandler();
    }


    protected constructor() {
    }


    public get type(): MoveType.Attack {
        return MoveType.Attack;
    }


    /** @virtual */
    public apply(from: BoardIndex, to: BoardIndex, draft: ChessStateDraft): void {
        const { board } = draft;
        draft.deletedPieces.push(board[to]!);
        board[to] = board[from]!.asMoved();
        board[from] = undefined;
    }
}

export const attackHandlerInstance = instance;
