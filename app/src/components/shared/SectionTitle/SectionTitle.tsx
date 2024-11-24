import type { FC, PropsWithChildren } from "react";
import { Heading } from "../Heading";
import classes from "./SectionTitle.module.scss";

type Props = PropsWithChildren;

export const SectionTitle: FC<Props> = ({ children }) => {
	return (
		<header className={classes.sectionTitle}>
			<Heading level={1} className={classes.sectionTitle__title}>
				{children}
			</Heading>
		</header>
	);
};
