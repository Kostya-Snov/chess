import type { FC } from "react";
import { MoveType } from "@/chess/Move";
import classes from "./Cell.module.scss";


type Props = {
    readonly isBlack: boolean;
    readonly moveType: MoveType | undefined;
    readonly onClick: (() => void) | undefined;
};

const signTypeClassIds = {
    [MoveType.Movement]: "movement",
    [MoveType.Attack]: "attack"
} as const;

export const Cell: FC<Props> = ({ isBlack, moveType, onClick }) => (
    <div
        className={
            classes["cell"]
            + " " + classes[isBlack ? "white" : "black"]
        }
        onClick={onClick}
    >
        <div className={
            classes["sign"]
            + " " + classes[moveType === undefined ? "none" : signTypeClassIds[moveType]]
        }/>
    </div>
);
