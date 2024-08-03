"use client";

import { type FC } from "react";
import classes from "../Chess.module.scss";
import { Board } from "./Board";
import { bottomSignatures, leftSignatures, rightSignatures, topSignatures } from "./signatures";


export const Chess: FC = () => (
    <div className={classes["boardWithSignatures"]}>
        {rightSignatures}
        {topSignatures}
        {leftSignatures}
        {bottomSignatures}
        <Board/>
    </div>
);
