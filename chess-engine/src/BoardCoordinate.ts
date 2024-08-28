import { type BoardIndex } from "./BoardIndex";
import { ChessConstants } from "./ChessConstants";


declare const brandKey: unique symbol;

declare class Brand {
    declare private readonly [brandKey]: never;
}

export type BoardCoordinate = Brand & number;

export const isBoardCoordinate = (value: number): value is BoardCoordinate =>
    value >= 0
    && value < ChessConstants.BoardSize
    && Number.isInteger(value);

export const getX = (index: BoardIndex) => index % ChessConstants.BoardSize as BoardCoordinate;

export const getY = (index: BoardIndex) =>
    Math.floor(index / ChessConstants.BoardSize) as BoardCoordinate;
