import { ChessConstants } from "@/chess/ChessConstants";
import { createArray } from "@/utils/createArray";
import classes from "../signatures.module.scss";


const createSignatures = (position: string, getText: (index: number) => string) => (
    <div className={classes[position + "Signatures"]}>
        {createArray(ChessConstants.BoardSize, i => <div key={i}>{getText(i)}</div>)}
    </div>
);


const getFileSignatureText = (index: number) => String.fromCharCode("h".charCodeAt(0) - index);

export const topSignatures = createSignatures("top", getFileSignatureText);

export const bottomSignatures = createSignatures("bottom", getFileSignatureText);


const getRankSignatureText = (index: number) => (index + 1).toString();

export const leftSignatures = createSignatures("left", getRankSignatureText);

export const rightSignatures = createSignatures("right", getRankSignatureText);
