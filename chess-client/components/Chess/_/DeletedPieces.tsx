import { type Piece } from "@/chess/Piece";
import { CSSModuleClasses } from "chess-utils";
import { type FC } from "react";
import uncheckedClasses from "../DeletedPieces.module.scss";
import { Panel } from "./Panel";
import { PieceImage } from "./PieceImage";


const classes = new CSSModuleClasses(uncheckedClasses);


export type DeletedPiecesProps = {
    readonly pieces: readonly Piece[];
};

export const DeletedPieces: FC<DeletedPiecesProps> = ({ pieces }) => (
    <Panel>
        <h2>Захоплені фігури</h2>
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
    </Panel>
);
