"use client";

import type * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { CreditCard as CreditCardIcon } from "@phosphor-icons/react/dist/ssr/CreditCard";
import { LockKey as LockKeyIcon } from "@phosphor-icons/react/dist/ssr/LockKey";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { paths } from "@/paths";
import { useAuth } from "@/components/auth/supabase/auth-context";
import { RouterLink } from "@/components/core/link";

function SignOutButton(): React.JSX.Element {
	const { signOut } = useAuth();
	return (
		<MenuItem component="a" href={paths.home} sx={{ justifyContent: "center" }} onClick={signOut}>
			Sign out
		</MenuItem>
	);
}

export interface UserPopoverProps {
	anchorEl: null | Element;
	onClose?: () => void;
	open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
	const { user, member } = useAuth();
	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			onClose={onClose}
			open={Boolean(open)}
			slotProps={{ paper: { sx: { width: "280px" } } }}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
		>
			<Box sx={{ p: 2 }}>
				<Typography>{member?.name}</Typography>
				<Typography color="text.secondary" variant="body2">
					{user?.email}
				</Typography>
			</Box>
			<Divider />
			{/* <List sx={{ p: 1 }}>
				<MenuItem component={RouterLink} href={paths.dashboard.settings.account} onClick={onClose}>
					<ListItemIcon>
						<UserIcon />
					</ListItemIcon>
					Account
				</MenuItem>
				<MenuItem component={RouterLink} href={paths.dashboard.settings.security} onClick={onClose}>
					<ListItemIcon>
						<LockKeyIcon />
					</ListItemIcon>
					Security
				</MenuItem>
				<MenuItem component={RouterLink} href={paths.dashboard.settings.billing} onClick={onClose}>
					<ListItemIcon>
						<CreditCardIcon />
					</ListItemIcon>
					Billing
				</MenuItem>
			</List> */}
			<Divider />
			<Box sx={{ p: 1 }}>
				<SignOutButton />
			</Box>
		</Popover>
	);
}
