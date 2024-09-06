import { permanentRedirect } from "next/navigation";
import { type FC } from "react";


export const RootPage: FC = () => permanentRedirect("./online");
