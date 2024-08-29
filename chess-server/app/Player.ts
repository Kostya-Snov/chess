import { type ChessState } from "chess-engine";
import { asErrorResponse, type GameResponse } from "./GameResponse";


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
            ? asErrorResponse("Invalid request.", request)
            : asErrorResponse(
                "Now it is the opponent's turn.",
                {
                    playerIsBlack: this.isBlack
                }
            );
    }
}
