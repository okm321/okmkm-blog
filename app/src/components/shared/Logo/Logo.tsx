import classes from "./Logo.module.scss";
import NextLink from "next/link";

export const Logo = () => {
	return (
		<NextLink href={"/"}>
			<div className={classes.logo}>okmkm.log</div>
		</NextLink>
	);
};
