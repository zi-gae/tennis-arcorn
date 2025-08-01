"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowSquareOut as ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CaretRight as CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";

import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";
import { isNavItemActive } from "@/lib/is-nav-item-active";
import { usePathname } from "@/hooks/use-pathname";
import { RouterLink } from "@/components/core/link";
import { Logo } from "@/components/core/logo";

import { icons } from "./nav-icons";
import { WorkspacesSwitch } from "./workspaces-switch";

export interface MobileNavProps {
	onClose?: () => void;
	open?: boolean;
	items?: NavItemConfig[];
}

export function MobileNav({ items = [], open, onClose }: MobileNavProps): React.JSX.Element {
	const pathname = usePathname();

	return (
		<Drawer
			PaperProps={{
				sx: {
					"--MobileNav-background": "var(--mui-palette-neutral-950)",
					"--MobileNav-color": "var(--mui-palette-common-white)",
					"--NavGroup-title-color": "var(--mui-palette-neutral-400)",
					"--NavItem-color": "var(--mui-palette-neutral-300)",
					"--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
					"--NavItem-active-background": "var(--mui-palette-primary-main)",
					"--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
					"--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
					"--NavItem-icon-color": "var(--mui-palette-neutral-400)",
					"--NavItem-icon-active-color": "var(--mui-palette-primary-contrastText)",
					"--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
					"--NavItem-expand-color": "var(--mui-palette-neutral-400)",
					"--NavItem-children-border": "var(--mui-palette-neutral-700)",
					"--NavItem-children-indicator": "var(--mui-palette-neutral-400)",
					"--Workspaces-background": "var(--mui-palette-neutral-950)",
					"--Workspaces-border-color": "var(--mui-palette-neutral-700)",
					"--Workspaces-title-color": "var(--mui-palette-neutral-400)",
					"--Workspaces-name-color": "var(--mui-palette-neutral-300)",
					"--Workspaces-expand-color": "var(--mui-palette-neutral-400)",
					bgcolor: "var(--MobileNav-background)",
					color: "var(--MobileNav-color)",
					display: "flex",
					flexDirection: "column",
					maxWidth: "100%",
					width: "var(--MobileNav-width)",
					zIndex: "var(--MobileNav-zIndex)",
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": { display: "none" },
				},
			}}
			onClose={onClose}
			open={open}
		>
			<Stack spacing={2} sx={{ p: 2 }}>
				<div>
					<Box component={RouterLink} href={paths.home} sx={{ display: "inline-flex" }}>
						<Logo color="light" height={32} width={122} />
					</Box>
				</div>
				<WorkspacesSwitch />
			</Stack>
			<Box component="nav" sx={{ flex: "1 1 auto", p: 2 }}>
				{renderNavGroups({ items, onClose, pathname })}
			</Box>
		</Drawer>
	);
}

function renderNavGroups({
	items,
	onClose,
	pathname,
}: {
	items: NavItemConfig[];
	onClose?: () => void;
	pathname: string;
}): React.JSX.Element {
	const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
		acc.push(
			<Stack component="li" key={curr.key} spacing={1.5}>
				{curr.title ? (
					<div>
						<Typography sx={{ color: "var(--NavGroup-title-color)", fontSize: "0.875rem", fontWeight: 500 }}>
							{curr.title}
						</Typography>
					</div>
				) : null}
				<div>{renderNavItems({ depth: 0, items: curr.items, onClose, pathname })}</div>
			</Stack>
		);

		return acc;
	}, []);

	return (
		<Stack component="ul" spacing={2} sx={{ listStyle: "none", m: 0, p: 0 }}>
			{children}
		</Stack>
	);
}

function renderNavItems({
	depth = 0,
	items = [],
	onClose,
	pathname,
}: {
	depth: number;
	items?: NavItemConfig[];
	onClose?: () => void;
	pathname: string;
}): React.JSX.Element {
	const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
		const { items: childItems, key, ...item } = curr;

		const forceOpen = childItems
			? childItems.some((childItem) => childItem.href && pathname.startsWith(childItem.href))
			: false;

		acc.push(
			<NavItem depth={depth} forceOpen={forceOpen} key={key} onClose={onClose} pathname={pathname} {...item}>
				{childItems ? renderNavItems({ depth: depth + 1, items: childItems, onClose, pathname }) : null}
			</NavItem>
		);

		return acc;
	}, []);

	return (
		<Stack component="ul" data-depth={depth} spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
			{children}
		</Stack>
	);
}

interface NavItemProps extends Omit<NavItemConfig, "items"> {
	children?: React.ReactNode;
	depth: number;
	forceOpen?: boolean;
	onClose?: () => void;
	pathname: string;
}

function NavItem({
	children,
	depth,
	disabled,
	external,
	forceOpen = false,
	href,
	icon,
	label,
	matcher,
	onClose,
	pathname,
	title,
}: NavItemProps): React.JSX.Element {
	const [open, setOpen] = React.useState<boolean>(forceOpen);
	const active = isNavItemActive({ disabled, external, href, matcher, pathname });
	const Icon = icon ? icons[icon] : null;
	const ExpandIcon = open ? CaretDownIcon : CaretRightIcon;
	const isBranch = children && !href;
	const showChildren = Boolean(children && open);

	return (
		<Box component="li" data-depth={depth} sx={{ userSelect: "none" }}>
			<Box
				{...(isBranch
					? {
							onClick: (): void => {
								setOpen(!open);
							},
							onKeyUp: (event: React.KeyboardEvent<HTMLElement>): void => {
								if (event.key === "Enter" || event.key === " ") {
									setOpen(!open);
								}
							},
							role: "button",
						}
					: {
							...(href
								? {
										component: external ? "a" : RouterLink,
										href,
										target: external ? "_blank" : undefined,
										rel: external ? "noreferrer" : undefined,
										onClick: (): void => {
											onClose?.();
										},
									}
								: { role: "button" }),
						})}
				sx={{
					alignItems: "center",
					borderRadius: 1,
					color: "var(--NavItem-color)",
					cursor: "pointer",
					display: "flex",
					flex: "0 0 auto",
					gap: 1,
					p: "6px 16px",
					position: "relative",
					textDecoration: "none",
					whiteSpace: "nowrap",
					...(disabled && {
						bgcolor: "var(--NavItem-disabled-background)",
						color: "var(--NavItem-disabled-color)",
						cursor: "not-allowed",
					}),
					...(active && {
						bgcolor: "var(--NavItem-active-background)",
						color: "var(--NavItem-active-color)",
						...(depth > 0 && {
							"&::before": {
								bgcolor: "var(--NavItem-children-indicator)",
								borderRadius: "2px",
								content: '" "',
								height: "20px",
								left: "-14px",
								position: "absolute",
								width: "3px",
							},
						}),
					}),
					...(open && { color: "var(--NavItem-open-color)" }),
					"&:hover": {
						...(!disabled &&
							!active && { bgcolor: "var(--NavItem-hover-background)", color: "var(--NavItem-hover-color)" }),
					},
				}}
				tabIndex={0}
			>
				<Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", flex: "0 0 auto" }}>
					{Icon ? (
						<Icon
							fill={active ? "var(--NavItem-icon-active-color)" : "var(--NavItem-icon-color)"}
							fontSize="var(--icon-fontSize-md)"
							weight={forceOpen || active ? "fill" : undefined}
						/>
					) : null}
				</Box>
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography
						component="span"
						sx={{ color: "inherit", fontSize: "0.875rem", fontWeight: 500, lineHeight: "28px" }}
					>
						{title}
					</Typography>
				</Box>
				{label ? <Chip color="primary" label={label} size="small" /> : null}
				{external ? (
					<Box sx={{ alignItems: "center", display: "flex", flex: "0 0 auto" }}>
						<ArrowSquareOutIcon color="var(--NavItem-icon-color)" fontSize="var(--icon-fontSize-sm)" />
					</Box>
				) : null}
				{isBranch ? (
					<Box sx={{ alignItems: "center", display: "flex", flex: "0 0 auto" }}>
						<ExpandIcon color="var(--NavItem-expand-color)" fontSize="var(--icon-fontSize-sm)" />
					</Box>
				) : null}
			</Box>
			{showChildren ? (
				<Box sx={{ pl: "24px" }}>
					<Box sx={{ borderLeft: "1px solid var(--NavItem-children-border)", pl: "12px" }}>{children}</Box>
				</Box>
			) : null}
		</Box>
	);
}
