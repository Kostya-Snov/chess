import { type BoardIndex } from "../../BoardIndex";
import { type ChessStateDraft } from "../ChessStateDraft";
import { MovementHandler } from "./MovementHandler";


let instance: PawnFirstMovementHandler;

export class PawnFirstMovementHandler extends MovementHandler {
    static {
        instance = new PawnFirstMovementHandler();
    }


    public override apply(from: BoardIndex, to: BoardIndex, draft: ChessStateDraft): void {
        super.apply(from, to, draft);
        draft.doubleMovementPawnIndex = to;
    }
}

export const pawnFirstMovementHandlerInstance = instance;
