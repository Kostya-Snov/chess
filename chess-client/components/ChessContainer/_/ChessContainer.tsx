import { WidthOverflowContainer } from "@/components/WidthOverflowContainer";
import { CSSModuleClasses } from "chess-utils";
import { type FC, type ReactNode } from "react";
import uncheckedClasses from "../ChessContainer.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type ChessContainerProps = {
    readonly children?: ReactNode;
};

export const ChessContainer: FC<ChessContainerProps> = ({ children }) => (
    <div className={classes.get("wrapper")}>
        <WidthOverflowContainer className={classes.get("container")}>
            {children}
        </WidthOverflowContainer>
    </div>
);
