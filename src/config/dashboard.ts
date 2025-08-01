import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";

// NOTE: We did not use React Components for Icons, because
//  you may want to get the config from the server.

// NOTE: First level of navItem elements are groups.

export interface DashboardConfig {
	// Overriden by Settings Context.
	layout: "horizontal" | "vertical";
	// Overriden by Settings Context.
	navColor: "blend_in" | "discrete" | "evident";
	navItems: NavItemConfig[];
}

export const dashboardConfig = {
	layout: "vertical",
	navColor: "evident",
	navItems: [
		{
			key: "dashboards",
			title: "Dashboards",
			items: [{ key: "overview", title: "Overview", href: paths.dashboard.overview, icon: "house" }],
		},
		{
			key: "members",
			title: "Members",
			items: [
				{ key: "members", title: "Members List", href: paths.dashboard.members.list, icon: "users" },
				// { key: "members-new", title: "Add Member", href: paths.dashboard.members.create, icon: "upload" },
				{ key: "members-me", title: "Me", href: paths.dashboard.members.details(":id"), icon: "user" },
			],
		},
		// {
		// 	key: "attendance",
		// 	title: "Attendance",
		// 	items: [
		// 		{ key: "attendance", title: "Attendance List", href: "/dashboard/attendance", icon: "file" },
		// 		{ key: "my-attendance", title: "My Attendance", href: "/dashboard/my/attendance", icon: "calendar-check" },
		// 	],
		// },
		{
			key: "matches",
			title: "Matches",
			items: [
				{ key: "matches", title: "Matches List", href: paths.dashboard.matches.list, icon: "receipt" },
				{ key: "matches-new", title: "New Match", href: paths.dashboard.matches.create, icon: "upload" },
				{ key: "my-matches", title: "My Matches", href: paths.dashboard.matches.myMatches, icon: "link" },
			],
		},
		{
			key: "rankings",
			title: "Rankings",
			items: [{ key: "rankings", title: "Rankings", href: paths.dashboard.rankings.list, icon: "chart-pie" }],
		},
		// {
		// 	key: "groups",
		// 	title: "Groups",
		// 	items: [{ key: "groups", title: "Group Assignment", href: "/dashboard/groups", icon: "users" }],
		// },
		{
			key: "seasons",
			title: "Seasons",
			items: [
				{ key: "seasons", title: "Season List", href: paths.dashboard.seasons.list, icon: "calendar-check" },
				{ key: "seasons-new", title: "New Season", href: paths.dashboard.seasons.create, icon: "upload" },
			],
		},
		// {
		// 	key: "admin",
		// 	title: "Admin",
		// 	items: [
		// 		{ key: "admin-logs", title: "System Logs", href: "/dashboard/admin/logs", icon: "file" },
		// 		{ key: "admin-config", title: "Configuration", href: "/dashboard/admin/config", icon: "gear" },
		// 	],
		// },
	],
} satisfies DashboardConfig;
