import { type BoardCoordinate, getX, getY } from "../../BoardCoordinate";
import { type BoardIndex, getIndex } from "../../BoardIndex";
import { type ChessStateDraft } from "../ChessStateDraft";
import { type MoveHandler, MoveType } from "./MoveHandler";


let instance: EnPassantHandler;

export class EnPassantHandler implements MoveHandler {
    static {
        instance = new EnPassantHandler();
    }


    protected constructor() {
    }


    public get type(): MoveType.EnPassant {
        return MoveType.EnPassant;
    }


    /** @virtual */
    public apply(pawnFrom: BoardIndex, pawnTo: BoardIndex, { board }: ChessStateDraft): void {
        const pawn = board[pawnFrom]!;
        board[pawnTo] = pawn;
        board[pawnFrom] = undefined;

        const enemyPawnIndex = getIndex(
            getX(pawnTo),
            getY(pawnTo) - (pawn.isBlack ? -1 : 1) as BoardCoordinate
        );
        board[enemyPawnIndex] = undefined;
    }
}

export const enPassantHandlerInstance = instance;
