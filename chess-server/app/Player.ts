import { type ChessState, isBoardIndex, PieceType, type PromotionPieceType } from "chess-engine";
import { asErrorResponse, type GameResponse, successGameResponse } from "./GameResponse";


const promotionPieceTypes: readonly number[] = [
    PieceType.Rook,
    PieceType.Knight,
    PieceType.Bishop,
    PieceType.Queen
] satisfies PromotionPieceType[];

const isPromotionPieceType = (value: number): value is PromotionPieceType =>
    promotionPieceTypes.includes(value);


export type Game = {
    state: ChessState;
};


export class Player {
    public constructor(
        public readonly game: Game,
        public readonly isBlack: boolean
    ) {
    }


    public handleRequest(request: unknown): GameResponse {
        return this.game.state.isBlacksTurn === this.isBlack
            ? null
            ?? this.handleMoveRequest(request)
            ?? this.handlePawnPromotionRequest(request)
            ?? asErrorResponse("Invalid request.", request)
            : asErrorResponse(
                "Now it is the opponent's turn.",
                {
                    playerIsBlack: this.isBlack
                }
            );
    }


    private handleMoveRequest(request: unknown): GameResponse | null {
        if (!(
            typeof request === "object"
            && request !== null
            && "from" in request
            && "to" in request
        )) {
            return null;
        }
        const { from, to } = request;

        if (!(
            typeof from === "number"
            && isBoardIndex(from)
            && typeof to === "number"
            && isBoardIndex(to)
        )) {
            return asErrorResponse("Invalid move request.", { from, to });
        }

        const { game } = this;
        const { state } = game;

        const piece = state.board[from];
        if (piece === undefined) {
            return asErrorResponse("The piece at the given position does not exist.", from);
        }
        if (piece.isBlack !== this.isBlack) {
            return asErrorResponse(
                "Cannot move with an opponent's piece.",
                {
                    playerIsBlack: this.isBlack
                }
            );
        }

        const move = state.getMoves(from).get(to);
        if (move === undefined) {
            return asErrorResponse("A move to a given position is not allowed.", to);
        }

        game.state = move.state;
        return successGameResponse;
    }


    private handlePawnPromotionRequest(request: unknown): GameResponse | null {
        if (typeof request !== "number") {
            return null;
        }
        const pieceType = request;

        if (!isPromotionPieceType(pieceType)) {
            return asErrorResponse("Invalid pawn promotion request.", pieceType);
        }

        const { game } = this;
        const { state } = game;

        if (state.promotionIndex === null) {
            return asErrorResponse("Now there is no pawn promotion.");
        }

        game.state = state.replaceInPromotion(pieceType);
        return successGameResponse;
    }
}
