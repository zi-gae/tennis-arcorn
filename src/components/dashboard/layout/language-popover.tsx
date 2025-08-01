"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import { setSettings as setPersistedSettings } from "@/lib/settings";
import { useSettings } from "@/components/core/settings/settings-context";
import { toast } from "@/components/core/toaster";

export type Language = "en" | "de" | "es";

export const languageFlags = {
	en: "/assets/flag-uk.svg",
	de: "/assets/flag-de.svg",
	es: "/assets/flag-es.svg",
} as const;

const languageOptions = {
	en: { icon: "/assets/flag-uk.svg", label: "English" },
	de: { icon: "/assets/flag-de.svg", label: "German" },
	es: { icon: "/assets/flag-es.svg", label: "Spanish" },
} as const;

export interface LanguagePopoverProps {
	anchorEl: null | Element;
	onClose?: () => void;
	open?: boolean;
}

export function LanguagePopover({ anchorEl, onClose, open = false }: LanguagePopoverProps): React.JSX.Element {
	const { settings } = useSettings();
	const { t, i18n } = useTranslation();

	const handleChange = React.useCallback(
		async (language: Language): Promise<void> => {
			onClose?.();
			setPersistedSettings({ ...settings, language });
			document.documentElement.lang = language;
			await i18n.changeLanguage(language);
			toast.success(t("common:languageChanged"));
		},
		[onClose, t, i18n, settings]
	);

	return (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			onClose={onClose}
			open={open}
			slotProps={{ paper: { sx: { width: "220px" } } }}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
		>
			{(Object.keys(languageOptions) as Language[]).map((language) => {
				const option = languageOptions[language];

				return (
					<MenuItem
						key={language}
						onClick={(): void => {
							handleChange(language).catch(() => {
								// ignore
							});
						}}
					>
						<ListItemIcon>
							<Box sx={{ height: "28px", width: "28px" }}>
								<Box alt={option.label} component="img" src={option.icon} sx={{ height: "auto", width: "100%" }} />
							</Box>
						</ListItemIcon>
						<Typography variant="subtitle2">{option.label}</Typography>
					</MenuItem>
				);
			})}
		</Menu>
	);
}
