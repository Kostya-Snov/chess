"use client";

import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import { createArray } from "@/utils/createArray";
import classes from "./Chess.module.scss";
import whiteRookImage from "./images/whiteRook.png";


const enum Constants {
    BoardSize = 8,
    BoardLength = BoardSize ** 2,
    ACharCode = 97
}


const createSignatures = (position: string, getText: (index: number) => string) => createArray(
    Constants.BoardSize,
    i => (
        <div
            key={i}
            className={
                classes["signature"]
                + " " + classes[position + "Signature"]
            }
        >
            {getText(i)}
        </div>
    )
);
const getFileSignatureText = (index: number) => String.fromCharCode(Constants.ACharCode + index);
const topSignatures = createSignatures("top", getFileSignatureText);
const bottomSignatures = createSignatures("bottom", getFileSignatureText);
const getRankSignatureText = (index: number) => (index + 1).toString();
const leftSignatures = createSignatures("left", getRankSignatureText);
const rightSignatures = createSignatures("right", getRankSignatureText);

export const Chess: FC = () => {
    const [[x, y], setPosition] = useState<[number, number]>([0, 0]);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsActive(false);
            }
        }
        addEventListener("keyup", listener);
        return () => removeEventListener("keyup", listener);
    }, []);


    return (
        <>
            <div className={classes["board"]}>
                {topSignatures}
                {bottomSignatures}
                {leftSignatures}
                {rightSignatures}
                {createArray(Constants.BoardLength, i => (
                    <div
                        key={i}
                        className={
                            classes["cell"]
                            + " " + classes[
                                (
                                    Math.floor(i / Constants.BoardSize) + i % Constants.BoardSize
                                ) % 2 === 0
                                    ? "white"
                                    : "black"
                                ]
                        }
                    >
                        <div className={
                            classes["sign"]
                            + " " + classes[
                                isActive
                                    ? "movement"
                                    : "none"
                                ]
                        }/>
                    </div>
                ))}

                <Image
                    className={
                        classes["piece"]
                        + (
                            isActive
                                ? " " + classes["active"]
                                : ""
                        )
                        + " " + classes["piece" + x + "_" + y]
                    }
                    src={whiteRookImage}
                    alt="whiteRook"
                    onClick={() => setIsActive(true)}
                />
            </div>

            <button
                style={{ marginLeft: "5rem" }}
                onClick={() => setPosition([
                    Math.floor(Math.random() * 8),
                    Math.floor(Math.random() * 8)
                ])}
            >
                Random
            </button>
        </>
    );
}
