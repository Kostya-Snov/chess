import type { FC } from "react";
import { MoveType } from "@/chess/Move";
import classes from "../Cell.module.scss";


const signTypeClassIds = {
    [MoveType.Movement]: "movement",
    [MoveType.Attack]: "attack",
    [MoveType.EnPassant]: "enPassant",
    [MoveType.Castling]: "castling"
} as const;


type Props = {
    readonly isBlack: boolean;
    readonly moveType: MoveType | undefined;
    readonly onClick: (() => void) | undefined;
};

export const Cell: FC<Props> = ({ isBlack, moveType, onClick }) => (
    <div
        className={
            classes["cell"]
            + " " + classes[isBlack ? "black" : "white"]
        }
        onClick={onClick}
    >
        <div className={
            classes["sign"]
            + " " + classes[moveType === undefined ? "none" : signTypeClassIds[moveType]]
        }/>
    </div>
);
