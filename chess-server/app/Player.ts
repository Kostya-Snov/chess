import { type ChessState, isBoardIndex } from "chess-engine";
import { asErrorResponse, type GameResponse, successGameResponse } from "./GameResponse";


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
}
