import { type BoardIndex } from "chess-engine";


export class PieceSelection {
    public constructor(
        public readonly index: BoardIndex,
        public readonly isReadyForDeselection: boolean,
        public readonly draggingProportionShift: readonly [x: number, y: number] | null
    ) {
    }


    public with(
        isReadyForDeselection: boolean,
        draggingProportionShift: readonly [x: number, y: number] | null
    ): PieceSelection {
        return new PieceSelection(this.index, isReadyForDeselection, draggingProportionShift);
    }
}
