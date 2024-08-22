import { type BoardCoordinate, isBoardCoordinate } from "../../BoardCoordinate";
import { type BoardIndex, getIndex } from "../../BoardIndex";
import { ChessConstants } from "../../ChessConstants";


export type Direction = readonly [dx: number, dy: number];

export const straightDirections: readonly Direction[] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];
export const diagonalDirections: readonly Direction[] = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1]
];


export type MovePattern = readonly [...Direction, numberIterations: number];

export const getMovePatterns = (directions: readonly Direction[], numberIterations: number) =>
    directions.map<MovePattern>(([dx, dy]) => [dx, dy, numberIterations]);

export const getOneWayMovePatterns = (directions: readonly Direction[]) =>
    getMovePatterns(directions, 1);

export const getInfinityMovePatterns = (directions: readonly Direction[]) =>
    getMovePatterns(directions, ChessConstants.BoardSize - 1);

export const getMovePatternIndices = function* (
    fromX: BoardCoordinate,
    fromY: BoardCoordinate,
    [dx, dy, numberIterations]: MovePattern
): Iterable<BoardIndex> {
    for (
        let
            i = 0,
            x = fromX + dx,
            y = fromY + dy;

        i !== numberIterations
        && isBoardCoordinate(x)
        && isBoardCoordinate(y);

        /**/++i,
            x = x + dx,
            y = y + dy
    ) {
        yield getIndex(x, y);
    }
};
