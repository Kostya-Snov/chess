import { CSSModuleClasses } from "chess-utils";
import { type Metadata } from "next";
import { type FC } from "react";
import uncheckedClasses from "./_/not-found.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export const metadata: Metadata = {
    title: "Not found"
};


const RootNotFound: FC = () => <h1 className={classes.get("title")}>Не знайдено!</h1>;


export default RootNotFound;
