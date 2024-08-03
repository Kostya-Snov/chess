import { type BoardIndex } from "../../BoardIndex";
import { type ChessStateDraft } from "../ChessStateDraft";
import { type MoveHandler, MoveType } from "./MoveHandler";


let instance: CastlingHandler;

export class CastlingHandler implements MoveHandler {
    static {
        instance = new CastlingHandler();
    }


    protected constructor() {
    }


    public get type(): MoveType.Castling {
        return MoveType.Castling;
    }


    /** @virtual */
    public apply(kingFrom: BoardIndex, kingTo: BoardIndex, { board }: ChessStateDraft): void {
        board[kingTo] = board[kingFrom]!.asMoved();
        board[kingFrom] = undefined;

        const [rookFrom, rookTo] = kingTo < kingFrom
            ? [kingTo - 1 as BoardIndex, kingTo + 1 as BoardIndex]
            : [kingTo + 2 as BoardIndex, kingTo - 1 as BoardIndex];
        board[rookTo] = board[rookFrom]!.asMoved();
        board[rookFrom] = undefined;
    }
}

export const castlingHandlerInstance = instance;
