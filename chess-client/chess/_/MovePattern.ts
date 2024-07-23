import { ChessConstants } from "../ChessConstants";
import { type BoardIndex, getIndex } from "../BoardIndex";
import { type BoardCoordinate, isBoardCoordinate } from "../BoardCoordinate";


export type Direction = readonly [dx: number, dy: number];

export type MovePattern = readonly [dx: number, dy: number, numberIterations: number];

export const getMovePatterns = (
    directions: Iterable<Direction>,
    numberIterations: number
): MovePattern[] => {
    const patterns: MovePattern[] = [];
    for (const [dx, dy] of directions) {
        patterns.push([dx, dy, numberIterations]);
    }
    return patterns;
}

export const getMoveOneWayPatterns = (directions: Iterable<Direction>) =>
    getMovePatterns(directions, 1);

export const getMoveInfinityPatterns = (directions: Iterable<Direction>) =>
    getMovePatterns(directions, ChessConstants.BoardSize - 1);


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
}
