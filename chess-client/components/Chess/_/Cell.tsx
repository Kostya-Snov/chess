import { MoveType } from "@/chess/Move";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC, type HTMLProps } from "react";
import uncheckedClasses from "../Cell.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const signClasses = {
    [MoveType.Movement]: classes.build("baseSign", "defaultSign", "movement"),
    [MoveType.Attack]: classes.build("baseSign", "attack"),
    [MoveType.EnPassant]: classes.build("baseSign", "defaultSign", "enPassant"),
    [MoveType.Castling]: classes.build("baseSign", "defaultSign", "castling")
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
                .add("cell")
                .add(isBlack ? "black" : "white")
                .addRaw(moveType === undefined ? undefined : signClasses[moveType])
                .addRaw(className)
                .class
        }
    />
);
