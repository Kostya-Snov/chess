import { ChessConstants } from "@/chess/ChessConstants";
import { createArray } from "@/utils/createArray";
import classes from "../signatures.module.scss";


const createSignatures = (position: string, getText: (index: number) => string) => (
    <div className={classes[position + "Signatures"]}>
        {createArray(ChessConstants.BoardSize, i => <div key={i}>{getText(i)}</div>)}
    </div>
);


const getFileSignatureText = (index: number) => String.fromCharCode("h".charCodeAt(0) - index);

const getRankSignatureText = (index: number) => (index + 1).toString();

export const signatures = (
    <>
        {createSignatures("top", getFileSignatureText)}
        {createSignatures("bottom", getFileSignatureText)}
        {createSignatures("left", getRankSignatureText)}
        {createSignatures("right", getRankSignatureText)}
    </>
);


const getFlippedFileSignatureText = (index: number) =>
    getFileSignatureText(ChessConstants.BoardSize - 1 - index);

const getFlippedRankSignatureText = (index: number) =>
    getRankSignatureText(ChessConstants.BoardSize - 1 - index);

export const flippedSignatures = (
    <>
        {createSignatures("top", getFlippedFileSignatureText)}
        {createSignatures("bottom", getFlippedFileSignatureText)}
        {createSignatures("left", getFlippedRankSignatureText)}
        {createSignatures("right", getFlippedRankSignatureText)}
    </>
);
