import type { FC } from "react";
import { Chess } from "./_/Chess";
import classes from "./_/page.module.scss";


const RootPage: FC = () => (
    <div className={classes["container"]}>
        <Chess/>
    </div>
);


export default RootPage;
