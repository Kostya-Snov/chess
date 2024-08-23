import { PieceType, type PromotionPieceType } from "@/chess/Piece";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC } from "react";
import uncheckedClasses from "../PromotionModal.module.scss";
import { Panel } from "./Panel";
import { PieceImage } from "./PieceImage";


const classes = new CSSModuleClasses(uncheckedClasses);


const promotionPieceTypes = [
    PieceType.Rook,
    PieceType.Knight,
    PieceType.Bishop,
    PieceType.Queen
] as const;


export type PromotionModalProps = {
    readonly isBlack: boolean;
    readonly isOpen: boolean;
    readonly onPieceClick: (type: PromotionPieceType) => void;
};

export const PromotionModal: FC<PromotionModalProps> = ({ isBlack, isOpen, onPieceClick }) => (
    <div className={classes.build().add("container").addIf(isOpen, "open").class}>
        <Panel className={classes.build("content", "pieces")}>
            {promotionPieceTypes.map(type => (
                <PieceImage
                    key={type}
                    className={classes.get("piece")}
                    type={type}
                    isBlack={isBlack}
                    onClick={() => onPieceClick(type)}
                />
            ))}
        </Panel>
    </div>
);
