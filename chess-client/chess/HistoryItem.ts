import type { Move, Rollback } from "./_/Move";


export type HistoryItem = {
    readonly move: Move;
    /** @internal */
    readonly rollback: Rollback;
};
