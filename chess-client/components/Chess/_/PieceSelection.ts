import { type BoardIndex } from "chess-engine";
import { assert } from "chess-utils";


export class PieceSelection {
    public constructor(
        public readonly index: BoardIndex,
        public readonly isReadyForDeselection: boolean,
        public readonly draggingProportionShift: readonly [x: number, y: number] | null
    ) {
        if (draggingProportionShift !== null) {
            const [x, y] = draggingProportionShift;
            assert(x >= 0 && x <= 1 && y >= 0 && y <= 1);
        }
    }


    public with(
        isReadyForDeselection: boolean,
        draggingProportionShift: readonly [x: number, y: number] | null
    ): PieceSelection {
        return new PieceSelection(this.index, isReadyForDeselection, draggingProportionShift);
    }
}
