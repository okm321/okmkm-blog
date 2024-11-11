"use client";

import { useColorTheme } from "@/providers/ColorThemeProvider";
import classes from "./ThemeSwitcher.module.scss";

export const ThemeSwitcher = () => {
	const { setColorTheme, actualColorTheme } = useColorTheme();

	const handleSwitch = () => {
		const newColorTheme = actualColorTheme === "light" ? "dark" : "light";
		setColorTheme(newColorTheme);
	};
	return (
		<button className={classes.switch} onClick={handleSwitch} type="button" />
	);
};
