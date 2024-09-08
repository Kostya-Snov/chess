import { Modal } from "@/components/Modal";
import { PieceType, type PromotionPieceType } from "chess-engine";
import { CSSModuleClasses } from "chess-utils";
import { type FC, useState } from "react";
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
    readonly isOpen: boolean;
    readonly isBlack: boolean;
    readonly onChoose: (type: PromotionPieceType) => void;
};

export const PromotionModal: FC<PromotionModalProps> = ({ isOpen, isBlack, onChoose }) => {
    const [isChosen, setIsChosen] = useState(false);

    return (
        <Modal isOpen={isOpen} onClosingEnd={() => setIsChosen(false)}>
            <Panel className={classes.get("pieces")}>
                {promotionPieceTypes.map(type => (
                    <PieceImage
                        key={type}
                        className={
                            classes.build()
                                .add("piece")
                                .addIf(!isChosen, "interactable")
                                .class
                        }
                        type={type}
                        isBlack={isChosen !== isBlack}
                        onClick={isChosen ? undefined : () => {
                            onChoose(type);
                            setIsChosen(true);
                        }}
                    />
                ))}
            </Panel>
        </Modal>
    );
};
