import type { RouteObject } from "react-router-dom";

export const route: RouteObject = {
	path: "auth",
	children: [
		{
			path: "callback",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/callback");
				return { Component: Page };
			},
		},
		{
			path: "recovery-link-sent",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/recovery-link-sent");
				return { Component: Page };
			},
		},
		{
			path: "reset-password",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/reset-password");
				return { Component: Page };
			},
		},
		{
			path: "sign-in",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/sign-in");
				return { Component: Page };
			},
		},
		{
			path: "sign-up",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/sign-up");
				return { Component: Page };
			},
		},
		{
			path: "sign-up-confirm",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/sign-up-confirm");
				return { Component: Page };
			},
		},
		{
			path: "update-password",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/update-password");
				return { Component: Page };
			},
		},
	],
};
