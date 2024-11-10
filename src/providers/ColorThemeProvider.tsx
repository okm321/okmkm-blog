"use client";
import { useMatchMedia } from "@/hooks/useMatchMedia";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { FC, ReactNode } from "react";

const LOCAL_STORAGE_KEY = "okmkm-blog-color-theme";
const ColorTheme = ["light", "dark", "system"] as const;
export type ColorTheme = (typeof ColorTheme)[number];

type ColorThemeContextValue = {
	colorTheme: ColorTheme | undefined;
	setColorTheme: (colorTheme: ColorTheme) => void;
	actualColorTheme: "light" | "dark" | undefined;
};

const ColorThemeContext = createContext<ColorThemeContextValue>({
	colorTheme: "system",
	setColorTheme: () => null,
	actualColorTheme: "light",
});

export const ColorThemeProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [colorTheme, _setColorTheme] = useState<ColorTheme>();
	const preferColorSchemeIsDark = useMatchMedia({
		query: "(prefers-color-scheme: dark)",
		initialState: true,
	});

	useEffect(() => {
		const storageValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storageValue === "light" || storageValue === "dark") {
			_setColorTheme(storageValue);
		} else {
			_setColorTheme("system");
		}
	}, []);

	const setColorTheme = useCallback((color: ColorTheme) => {
		_setColorTheme(color);
		window.localStorage.setItem(LOCAL_STORAGE_KEY, color);
	}, []);

	const actualColorTheme =
		colorTheme === "system"
			? preferColorSchemeIsDark
				? "dark"
				: "light"
			: colorTheme;

	const value: ColorThemeContextValue = useMemo(
		() => ({
			colorTheme,
			setColorTheme,
			actualColorTheme,
		}),
		[actualColorTheme, colorTheme, setColorTheme],
	);

	useEffect(() => {
		if (actualColorTheme) {
			document.documentElement.dataset.colorTheme = actualColorTheme;
		}
	}, [actualColorTheme]);

	return (
		<ColorThemeContext.Provider value={value}>
			{children}
		</ColorThemeContext.Provider>
	);
};

export const useColorTheme = () => {
	return useContext(ColorThemeContext);
};
