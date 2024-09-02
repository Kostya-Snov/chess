import { CSSModuleClasses } from "chess-utils";
import { type FC, type ReactNode } from "react";
import uncheckedClasses from "../Modal.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type ModalProps = {
    readonly isOpen: boolean;
    readonly children?: ReactNode;
};

export const Modal: FC<ModalProps> = ({ isOpen, children }) => (
    <div className={classes.build().add("container").addIf(isOpen, "open").class}>
        <div className={classes.get("content")}>
            {children}
        </div>
    </div>
);
