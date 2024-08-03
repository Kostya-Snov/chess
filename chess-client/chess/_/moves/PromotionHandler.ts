import { type BoardIndex } from "../../BoardIndex";
import { type ChessStateDraft } from "../ChessStateDraft";
import { attackHandlerInstance } from "./AttackHandler";
import { type MoveHandler, type MoveType } from "./MoveHandler";
import { movementHandlerInstance } from "./MovementHandler";


let movementInstance: PromotionHandler, attackInstance: PromotionHandler;

export class PromotionHandler implements MoveHandler {
    static {
        movementInstance = new PromotionHandler(movementHandlerInstance);
        attackInstance = new PromotionHandler(attackHandlerInstance);
    }


    protected constructor(private readonly coreHandler: MoveHandler) {
    }


    public get type(): MoveType {
        return this.coreHandler.type;
    }


    /** @virtual */
    public apply(from: BoardIndex, to: BoardIndex, draft: ChessStateDraft): void {
        this.coreHandler.apply(from, to, draft);
        draft.promotionIndex = to;
    }
}

export const movementPromotionHandlerInstance = movementInstance;
export const attackPromotionHandlerInstance = attackInstance;
