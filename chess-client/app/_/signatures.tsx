import { createArray } from "@/utils/createArray";
import { ChessConstants } from "@/chess/ChessConstants";
import classes from "./signatures.module.scss";


const createSignatures = (position: string, getText: (index: number) => string) => createArray(
    ChessConstants.BoardSize,
    i => (
        <div
            key={i}
            className={classes["signature"] + " " + classes[position]}
        >
            {getText(i)}
        </div>
    )
);


const getFileSignatureText = (index: number) => String.fromCharCode("a".charCodeAt(0) + index);

export const topSignatures = createSignatures("top", getFileSignatureText);

export const bottomSignatures = createSignatures("bottom", getFileSignatureText);


const getRankSignatureText = (index: number) => (index + 1).toString();

export const leftSignatures = createSignatures("left", getRankSignatureText);

export const rightSignatures = createSignatures("right", getRankSignatureText);
