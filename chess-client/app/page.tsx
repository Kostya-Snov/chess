import { permanentRedirect } from "next/navigation";
import { type FC } from "react";


const RootPage: FC = () => permanentRedirect("./online");


export default RootPage;
