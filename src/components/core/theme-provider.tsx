"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { appConfig } from "@/config/app";
import { useSettings } from "@/components/core/settings/settings-context";
import { createTheme } from "@/styles/theme/create-theme";

export interface ThemeProviderProps {
	children: React.ReactNode;
}

function CustomThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
	const { settings } = useSettings();
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const [mode, setMode] = useState<"light" | "dark">("light");

	useEffect(() => {
		const themeMode = prefersDarkMode ? "dark" : "light";
		setMode(themeMode as "light" | "dark");
	}, [prefersDarkMode]);

	const direction = settings.direction ?? appConfig.direction;
	const primaryColor = settings.primaryColor ?? appConfig.primaryColor;

	const theme = createTheme({
		direction,
		primaryColor,
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}

export { CustomThemeProvider as ThemeProvider };
