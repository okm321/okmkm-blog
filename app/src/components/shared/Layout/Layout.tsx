import type { FC, ReactNode } from "react";
import classes from "./Layout.module.scss";

type LayoutProps = {
	header: ReactNode;
	main: ReactNode;
	footer: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ header, main, footer }) => {
	return (
		<div className={classes.layout}>
			<div className={classes.content}>
				{header}
				{main}
			</div>
			{footer}
		</div>
	);
};
