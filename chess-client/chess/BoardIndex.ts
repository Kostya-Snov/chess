import { ChessConstants } from "./ChessConstants";
import type { BoardCoordinate } from "./BoardCoordinate";


declare const brandKey: unique symbol;

class Brand {
    declare private readonly [brandKey]: never;
}

export type BoardIndex = Brand & number;

export const isBoardIndex = (value: number): value is BoardIndex =>
    value >= 0
    && value < ChessConstants.BoardLength
    && Number.isInteger(value);

export const getIndex = (x: BoardCoordinate, y: BoardCoordinate) =>
    y * ChessConstants.BoardSize + x as BoardIndex;
