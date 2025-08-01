"use client";

import type * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider as Provider } from "@mui/x-date-pickers/LocalizationProvider";

export interface LocalizationProviderProps {
	children: React.ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps): React.JSX.Element {
	return (
		<Provider dateAdapter={AdapterDayjs} adapterLocale="ko">
			{children}
		</Provider>
	);
}
