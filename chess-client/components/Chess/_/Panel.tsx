import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC, type ReactNode } from "react";
import uncheckedClasses from "../Panel.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type PanelProps = {
    readonly className?: string | undefined;
    readonly children?: ReactNode;
};

export const Panel: FC<PanelProps> = ({ className, children }) => (
    <section className={classes.build().add("panel").addRaw(className).class}>
        {children}
    </section>
);
