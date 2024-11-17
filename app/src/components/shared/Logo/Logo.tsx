import classes from "./Logo.module.scss";
import NextLink from "next/link";

export const Logo = () => {
	return <NextLink href={'/'}><h1 className={classes.logo}>Okmkm</h1></NextLink>;
};
