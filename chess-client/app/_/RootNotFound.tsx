import { CSSModuleClasses } from "chess-utils";
import { type FC } from "react";
import uncheckedClasses from "./RootNotFound.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export const RootNotFound: FC = () => <h1 className={classes.get("title")}>Не знайдено!</h1>;
