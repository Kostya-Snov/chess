import { PieceType, type PromotionPieceType } from "chess-engine";
import { CSSModuleClasses } from "chess-utils";
import { type FC } from "react";
import uncheckedClasses from "../PromotionChoice.module.scss";
import { Panel } from "./Panel";
import { PieceImage } from "./PieceImage";


const classes = new CSSModuleClasses(uncheckedClasses);


const promotionPieceTypes = [
    PieceType.Rook,
    PieceType.Knight,
    PieceType.Bishop,
    PieceType.Queen
] as const;


export type PromotionChoiceProps = {
    readonly isBlack: boolean;
    readonly onChoose: (type: PromotionPieceType) => void;
};

export const PromotionChoice: FC<PromotionChoiceProps> = ({ isBlack, onChoose }) => (
    <Panel className={classes.get("pieces")}>
        {promotionPieceTypes.map(type => (
            <PieceImage
                key={type}
                className={classes.get("piece")}
                type={type}
                isBlack={isBlack}
                onClick={() => onChoose(type)}
            />
        ))}
    </Panel>
);
