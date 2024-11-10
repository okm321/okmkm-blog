import { GlobalNavigation } from "../GlobalNavigation";
import { Logo } from "../Logo";
import { ThemeSwitcher } from "../ThemeSwitcher";
import classes from "./Header.module.scss";

export const Header = () => {
	return (
		<header className={classes.header}>
			<Logo />
			<ThemeSwitcher />
			<GlobalNavigation />
		</header>
	);
};
