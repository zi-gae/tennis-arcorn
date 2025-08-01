import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import { AuthGuard } from "@/components/auth/supabase/auth-guard";
import { Layout as DashboardLayout } from "@/components/dashboard/layout/layout";

export const route: RouteObject = {
	path: "dashboard",
	element: (
		<AuthGuard>
			<DashboardLayout>
				<Outlet />
			</DashboardLayout>
		</AuthGuard>
	),
	children: [
		// Dashboard Overview
		{
			index: true,
			lazy: async () => {
				const { Page } = await import("@/pages/dashboard/overview");
				return { Component: Page };
				// const { Page } = await import("@/pages/dashboard/overview");
				// return { Component: Page };
			},
		},

		// Members
		{
			path: "members",
			lazy: async () => {
				const { Page } = await import("@/pages/members/list");
				return { Component: Page };
			},
		},
		{
			path: "members/:id",
			lazy: async () => {
				const { Page } = await import("@/pages/members/detail");
				return { Component: Page };
			},
		},
		{
			path: "members/edit/:id",
			lazy: async () => {
				const { Page } = await import("@/pages/members/edit");
				return { Component: Page };
			},
		},
		{
			path: "members/new",
			lazy: async () => {
				const { Page } = await import("@/pages/members/new");
				return { Component: Page };
			},
		},

		// Attendance
		{
			path: "attendance",
			lazy: async () => {
				const { Page } = await import("@/pages/attendance/index");
				return { Component: Page };
			},
		},
		{
			path: "attendance/:date",
			lazy: async () => {
				const { Page } = await import("@/pages/attendance/detail");
				return { Component: Page };
			},
		},
		{
			path: "my/attendance",
			lazy: async () => {
				const { Page } = await import("@/pages/attendance/my");
				return { Component: Page };
			},
		},

		// Reservations
		{
			path: "reservations",
			lazy: async () => {
				const { Page } = await import("@/pages/reservations/index");
				return { Component: Page };
			},
		},
		{
			path: "reservations/new",
			lazy: async () => {
				const { Page } = await import("@/pages/reservations/new");
				return { Component: Page };
			},
		},
		{
			path: "reservations/:id",
			lazy: async () => {
				const { Page } = await import("@/pages/reservations/detail");
				return { Component: Page };
			},
		},

		// Matches
		{
			path: "matches",
			lazy: async () => {
				const { Page } = await import("@/pages/matches/list");
				return { Component: Page };
			},
		},
		{
			path: "matches/:id",
			lazy: async () => {
				const { Page } = await import("@/pages/matches/detail");
				return { Component: Page };
			},
		},
		{
			path: "matches/new",
			lazy: async () => {
				const { Page } = await import("@/pages/matches/new");
				return { Component: Page };
			},
		},
		{
			path: "my/matches",
			lazy: async () => {
				const { Page } = await import("@/pages/dashboard/overview");
				return { Component: Page };
			},
		},

		// Rankings
		{
			path: "rankings",
			lazy: async () => {
				const { Page } = await import("@/pages/rankings/index");
				return { Component: Page };
			},
		},
		{
			path: "rankings/:id",
			lazy: async () => {
				const { Page } = await import("@/pages/rankings/detail");
				return { Component: Page };
			},
		},

		// Groups
		{
			path: "groups",
			lazy: async () => {
				const { Page } = await import("@/pages/groups/assignment");
				return { Component: Page };
			},
		},

		// Seasons
		{
			path: "seasons",
			lazy: async () => {
				const { Page } = await import("@/pages/seasons/list");
				return { Component: Page };
			},
		},
		{
			path: "seasons/new",
			lazy: async () => {
				const { Page } = await import("@/pages/seasons/new");
				return { Component: Page };
			},
		},

		// Dues
		{
			path: "dues",
			lazy: async () => {
				const { Page } = await import("@/pages/dues/list");
				return { Component: Page };
			},
		},
		{
			path: "dues/:id",
			lazy: async () => {
				const { Page } = await import("@/pages/dues/detail");
				return { Component: Page };
			},
		},
		{
			path: "my/dues",
			lazy: async () => {
				const { Page } = await import("@/pages/dues/my");
				return { Component: Page };
			},
		},

		// Board - Notice
		{
			path: "board/notice",
			lazy: async () => {
				const { Page } = await import("@/pages/board/notice/list");
				return { Component: Page };
			},
		},
		{
			path: "board/notice/:id",
			lazy: async () => {
				const { Page } = await import("@/pages/board/notice/detail");
				return { Component: Page };
			},
		},
		{
			path: "board/notice/new",
			lazy: async () => {
				const { Page } = await import("@/pages/board/notice/new");
				return { Component: Page };
			},
		},

		// Board - Free
		{
			path: "board/free",
			lazy: async () => {
				const { Page } = await import("@/pages/board/free/list");
				return { Component: Page };
			},
		},
		{
			path: "board/free/:id",
			lazy: async () => {
				const { Page } = await import("@/pages/board/free/detail");
				return { Component: Page };
			},
		},
		{
			path: "board/free/new",
			lazy: async () => {
				const { Page } = await import("@/pages/board/free/new");
				return { Component: Page };
			},
		},

		// Admin
		{
			path: "admin/logs",
			lazy: async () => {
				const { Page } = await import("@/pages/admin/logs");
				return { Component: Page };
			},
		},
		{
			path: "admin/config",
			lazy: async () => {
				const { Page } = await import("@/pages/admin/config");
				return { Component: Page };
			},
		},
	],
};
