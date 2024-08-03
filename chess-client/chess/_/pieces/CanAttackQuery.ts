import { type BoardCoordinate, getX, getY } from "../../BoardCoordinate";
import { type BoardIndex } from "../../BoardIndex";
import { type ChessState } from "../ChessState";
import { getMovePatternIndices, type MovePattern } from "./MovePattern";


export class CanAttackQuery {
    public constructor(
        public readonly from: BoardIndex,
        public readonly to: BoardIndex,
        public readonly state: ChessState
    ) {
    }


    public get fromX(): BoardCoordinate {
        return getX(this.from);
    }


    public get fromY(): BoardCoordinate {
        return getY(this.from);
    }


    public getDefault(attackPatterns: Iterable<MovePattern>): boolean {
        const { fromX, fromY, to, state: { board } } = this;

        for (const pattern of attackPatterns) {
            for (const currentTo of getMovePatternIndices(fromX, fromY, pattern)) {
                if (currentTo === to) {
                    return true;
                }
                if (board[currentTo] !== undefined) {
                    break;
                }
            }
        }

        return false;
    }
}
