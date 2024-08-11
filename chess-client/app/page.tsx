import { Chess } from "@/components/Chess";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC } from "react";
import uncheckedClasses from "./_/page.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const RootPage: FC = () => <Chess className={classes.get("chess")}/>;


export default RootPage;
