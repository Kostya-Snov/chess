import { type Piece } from "@/chess/Piece";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC } from "react";
import uncheckedClasses from "../DeletedPieces.module.scss";
import { PieceImage } from "./PieceImage";


const classes = new CSSModuleClasses(uncheckedClasses);


export type DeletedPiecesProps = {
    readonly pieces: readonly Piece[];
};

export const DeletedPieces: FC<DeletedPiecesProps> = ({ pieces }) => (
    <div>
        <h2 className={classes.get("title")}>Захоплені фігури</h2>
        <div className={classes.get("pieces")}>
            {pieces.map(piece => (
                <PieceImage
                    key={piece.id}
                    className={classes.get("piece")}
                    type={piece.type}
                    isBlack={piece.isBlack}
                />
            ))}
        </div>
    </div>
);
