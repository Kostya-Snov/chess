import { type BoardCoordinate, isBoardCoordinate } from "@/chess/BoardCoordinate";
import { ChessConstants } from "@/chess/ChessConstants";
import { assert } from "@/utils/assert";
import { createArray } from "@/utils/createArray";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC } from "react";
import uncheckedClasses from "../CoordinateNames.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


type GetNameText = (index: BoardCoordinate) => string;

const renderNames = (position: string, getText: GetNameText) => (
    <div className={classes.build("names", position)}>
        {createArray(ChessConstants.BoardSize, coordinate => {
            assert(isBoardCoordinate(coordinate));
            return <span key={coordinate}>{getText(coordinate)}</span>;
        })}
    </div>
);


const getDirectFileText: GetNameText = coordinate =>
    String.fromCharCode("h".charCodeAt(0) - coordinate);

const getDirectRankText: GetNameText = coordinate => (coordinate + 1).toString();

const directAllNames = (
    <>
        {renderNames("top", getDirectFileText)}
        {renderNames("right", getDirectRankText)}
        {renderNames("bottom", getDirectFileText)}
        {renderNames("left", getDirectRankText)}
    </>
);


const flip = (getText: GetNameText): GetNameText => directCoordinate => {
    const flippedCoordinate = ChessConstants.BoardSize - 1 - directCoordinate;
    assert(isBoardCoordinate(flippedCoordinate));
    return getText(flippedCoordinate);
}

const getFlippedFileText = flip(getDirectFileText);

const getFlippedRankText = flip(getDirectRankText);

const flippedAllNames = (
    <>
        {renderNames("top", getFlippedFileText)}
        {renderNames("right", getFlippedRankText)}
        {renderNames("bottom", getFlippedFileText)}
        {renderNames("left", getFlippedRankText)}
    </>
);


export type CoordinateNamesProps = {
    readonly isFlipped: boolean;
};

export const CoordinateNames: FC<CoordinateNamesProps> = ({ isFlipped }) =>
    isFlipped ? flippedAllNames : directAllNames;
