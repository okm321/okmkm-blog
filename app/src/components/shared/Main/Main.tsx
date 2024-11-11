import type { FC, PropsWithChildren } from "react";
import classes from "./Main.module.scss";

export const Main: FC<PropsWithChildren> = ({ children }) => {
	return <main className={classes.main}>{children}</main>;
};
