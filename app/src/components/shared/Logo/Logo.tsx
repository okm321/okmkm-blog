import NextLink from "next/link";
import classes from "./Logo.module.scss";

export const Logo = () => {
	return (
		<NextLink href={"/"}>
			<div className={classes.logo}>okmkm.log</div>
		</NextLink>
	);
};
