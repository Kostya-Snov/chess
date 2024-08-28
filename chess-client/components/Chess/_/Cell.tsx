import { MoveType } from "@/chess/Move";
import { CSSModuleClasses } from "chess-utils";
import { type FC, type HTMLProps } from "react";
import uncheckedClasses from "../Cell.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const signClassIds = {
    [MoveType.Movement]: "movement",
    [MoveType.Attack]: "attack",
    [MoveType.EnPassant]: "enPassant",
    [MoveType.Castling]: "castling"
} as const;


export type CellProps = Readonly<HTMLProps<HTMLDivElement>> & {
    readonly isBlack: boolean;
    readonly moveType: MoveType | undefined;
};

export const Cell: FC<CellProps> = ({ className, isBlack, moveType, ...props }) => (
    <div
        {...props}
        className={
            classes.build()
                .add(isBlack ? "black" : "white")
                .add(moveType === undefined ? undefined : signClassIds[moveType])
                .addRaw(className)
                .class
        }
    />
);
