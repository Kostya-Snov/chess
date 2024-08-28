import { InvalidOperationError } from "chess-utils";
import { type BoardIndex } from "./BoardIndex";
import { ChessConstants } from "./ChessConstants";
import { ChessStateDraft } from "./ChessStateDraft";
import { type Move } from "./moves/Move";
import { AddMovesQuery } from "./pieces/AddMovesQuery";
import { CanAttackQuery } from "./pieces/CanAttackQuery";
import { createPiece } from "./pieces/createPiece";
import { type Piece, PieceType } from "./pieces/Piece";
import { type PromotionPieceType } from "./PromotionPieceType";


declare const brandKey: unique symbol;

export class ChessState {
    declare private readonly [brandKey]: never;


    public constructor(
        public readonly board: readonly (Piece | undefined)[],
        public readonly deletedPieces: readonly Piece[],
        public readonly isBlacksTurn: boolean,
        public readonly doubleMovementPawnIndex: BoardIndex | null,
        public readonly promotionIndex: BoardIndex | null,
        // Cached to save 'canMove' value after the pawn promotion.
        public readonly cachedCanMove: boolean | null
    ) {
    }


    public inCurrentTurn(piece: Piece): boolean {
        return this.isBlacksTurn === piece.isBlack;
    }


    public getMoves(from: BoardIndex): Map<BoardIndex, Move> {
        if (this.promotionIndex !== null) {
            throw new InvalidOperationError("The promotion is not over.");
        }

        const piece = this.board[from];
        if (piece === undefined) {
            throw new InvalidOperationError("The piece at the given position is missing.");
        }
        if (!this.inCurrentTurn(piece)) {
            throw new InvalidOperationError("Now it is a different color turn.");
        }

        const query = new AddMovesQuery(from, this);
        piece.addMoves(query);
        return query.moves;
    }


    public replaceInPromotion(pieceType: PromotionPieceType): ChessState {
        const { promotionIndex } = this;
        if (promotionIndex === null) {
            throw new InvalidOperationError("There is no pawn to promotion.");
        }

        const draft = new ChessStateDraft(this);
        const { board } = draft;
        const pawn = board[promotionIndex]!;
        board[promotionIndex] = createPiece(pieceType, pawn.id, pawn.isBlack, true);
        draft.cachedCanMove = draft.promotionIndex = null;
        draft.isBlacksTurn = !draft.isBlacksTurn;
        return draft.getState();
    }


    public isShah(): boolean {
        const kingIndex = this.board.findIndex(piece =>
            piece !== undefined
            && piece.type === PieceType.King
            && this.inCurrentTurn(piece)
        ) as BoardIndex;
        return this.isUnderAttack(kingIndex);
    }


    public canMove(): boolean {
        return this.cachedCanMove ?? this.board.some((piece, index) => {
            if (piece === undefined || !this.inCurrentTurn(piece)) {
                return false;
            }
            const query = new AddMovesQuery(index as BoardIndex, this);
            piece.addMoves(query);
            return query.moves.size !== 0;
        });
    }


    /** @internal */
    public isUnderAttack(index: BoardIndex): boolean {
        return this.board.some((piece, currentIndex) =>
            piece !== undefined
            && !this.inCurrentTurn(piece)
            && piece.canAttack(new CanAttackQuery(currentIndex as BoardIndex, index, this))
        );
    }
}


const initialBoard = (() => {
    const board: (Piece | undefined)[] = [];
    let id = 0;
    let isBlack: boolean;

    const addPiece = (type: PieceType): void => {
        board.push(createPiece(type, id++, isBlack, false));
    };

    const addFiguresRank = (): void => {
        addPiece(PieceType.Rook);
        addPiece(PieceType.Knight);
        addPiece(PieceType.Bishop);
        addPiece(PieceType.King);
        addPiece(PieceType.Queen);
        addPiece(PieceType.Bishop);
        addPiece(PieceType.Knight);
        addPiece(PieceType.Rook);
    };

    const addPawnsRank = (): void => {
        for (let i = 0; i !== ChessConstants.BoardSize; ++i) {
            addPiece(PieceType.Pawn);
        }
    };

    const addEmptyRanks = (): void => {
        const enum Constants {
            EmptyRanksLength = 4 * ChessConstants.BoardSize
        }

        for (let i = 0; i !== Constants.EmptyRanksLength; ++i) {
            board.push(undefined);
        }
    };

    isBlack = false;
    addFiguresRank();
    addPawnsRank();

    addEmptyRanks();

    isBlack = true;
    addPawnsRank();
    addFiguresRank();

    return board;
})();

export const initialChessState = new ChessState(initialBoard, [], false, null, null, null);
