"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { paths } from "@/paths";
import { getMembers } from "@/lib/api/members";
import { FilterButton, FilterPopover, useFilterContext } from "@/components/core/filter-button";
import { Option } from "@/components/core/option";

import { useMembersSelection } from "./members-selection-context";

export interface TabItem {
	label: string;
	value: string;
	count: number;
}

export function useMembersTabs() {
	const [tabs, setTabs] = React.useState<TabItem[]>([
		{ label: "All", value: "", count: 0 },
		{ label: "Active", value: "active", count: 0 },
		{ label: "Inactive", value: "inactive", count: 0 },
	]);

	React.useEffect(() => {
		async function fetchCounts() {
			try {
				// Batch all requests together using Promise.all
				const [totalResult, activeResult, inactiveResult] = await Promise.all([
					getMembers(),
					getMembers({ status: "active" }),
					getMembers({ status: "inactive" }),
				]);

				setTabs([
					{ label: "All", value: "", count: totalResult.count || 0 },
					{ label: "Active", value: "active", count: activeResult.count || 0 },
					{ label: "Inactive", value: "inactive", count: inactiveResult.count || 0 },
				]);
			} catch (error) {
				console.error("Failed to fetch member counts:", error);
			}
		}

		fetchCounts();
	}, []);

	return tabs;
}

export interface Filters {
	email?: string;
	phone?: string;
	status?: string;
	role?: string;
	name?: string;
}

export type SortDir = "asc" | "desc";

export interface MembersFiltersProps {
	filters?: Filters;
	sortDir?: SortDir;
}

export function MembersFilters({ filters = {}, sortDir = "desc" }: MembersFiltersProps): React.JSX.Element {
	const { email, phone, status, role, name } = filters;
	const tabs = useMembersTabs();

	const navigate = useNavigate();

	const selection = useMembersSelection();

	const updateSearchParams = React.useCallback(
		(newFilters: Filters, newSortDir: SortDir): void => {
			const searchParams = new URLSearchParams();

			if (newSortDir === "asc") {
				searchParams.set("sortDir", newSortDir);
			}

			if (newFilters.status) {
				searchParams.set("status", newFilters.status);
			}

			if (newFilters.email) {
				searchParams.set("email", newFilters.email);
			}

			if (newFilters.phone) {
				searchParams.set("phone", newFilters.phone);
			}

			if (newFilters.role) {
				searchParams.set("role", newFilters.role);
			}

			if (newFilters.name) {
				searchParams.set("name", newFilters.name);
			}

			navigate(`${paths.dashboard.members.list}?${searchParams.toString()}`);
		},
		[navigate]
	);

	const handleClearFilters = React.useCallback(() => {
		updateSearchParams({}, sortDir);
	}, [updateSearchParams, sortDir]);

	const handleStatusChange = React.useCallback(
		(_: React.SyntheticEvent, value: string) => {
			updateSearchParams({ ...filters, status: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleEmailChange = React.useCallback(
		(value?: string) => {
			updateSearchParams({ ...filters, email: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handlePhoneChange = React.useCallback(
		(value?: string) => {
			updateSearchParams({ ...filters, phone: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleRoleChange = React.useCallback(
		(value?: string) => {
			updateSearchParams({ ...filters, role: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleNameChange = React.useCallback(
		(value?: string) => {
			updateSearchParams({ ...filters, name: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleSortChange = React.useCallback(
		(event: SelectChangeEvent) => {
			updateSearchParams(filters, event.target.value as SortDir);
		},
		[updateSearchParams, filters]
	);

	const hasFilters = status || email || phone || role || name;

	return (
		<div>
			<Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status ?? ""} variant="scrollable">
				{tabs.map((tab) => (
					<Tab
						icon={<Chip label={tab.count} size="small" variant="soft" />}
						iconPosition="end"
						key={tab.value}
						label={tab.label}
						sx={{ minHeight: "auto" }}
						tabIndex={0}
						value={tab.value}
					/>
				))}
			</Tabs>
			<Divider />
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", px: 3, py: 2 }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
					<FilterButton
						displayValue={email}
						label="Email"
						onFilterApply={(value) => {
							handleEmailChange(value as string);
						}}
						onFilterDelete={() => {
							handleEmailChange();
						}}
						popover={<EmailFilterPopover />}
						value={email}
					/>
					<FilterButton
						displayValue={name}
						label="Name"
						onFilterApply={(value) => {
							handleNameChange(value as string);
						}}
						onFilterDelete={() => {
							handleNameChange();
						}}
						popover={<SearchFilterPopover />}
						value={name}
					/>
					<FilterButton
						displayValue={phone}
						label="Phone number"
						onFilterApply={(value) => {
							handlePhoneChange(value as string);
						}}
						onFilterDelete={() => {
							handlePhoneChange();
						}}
						popover={<PhoneFilterPopover />}
						value={phone}
					/>
					<FilterButton
						displayValue={role}
						label="Role"
						onFilterApply={(value) => {
							handleRoleChange(value as string);
						}}
						onFilterDelete={() => {
							handleRoleChange();
						}}
						popover={<RoleFilterPopover />}
						value={role}
					/>

					{hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
				</Stack>
				{selection.selectedAny ? (
					<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
						<Typography color="text.secondary" variant="body2">
							{selection.selected.size} selected
						</Typography>
						<Button color="error" variant="contained">
							Delete
						</Button>
					</Stack>
				) : null}
				<Select name="sort" onChange={handleSortChange} sx={{ maxWidth: "100%", width: "120px" }} value={sortDir}>
					<Option value="desc">Newest</Option>
					<Option value="asc">Oldest</Option>
				</Select>
			</Stack>
		</div>
	);
}

function EmailFilterPopover(): React.JSX.Element {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState<string>("");

	React.useEffect(() => {
		setValue((initialValue as string | undefined) ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by email">
			<FormControl>
				<OutlinedInput
					onChange={(event) => {
						setValue(event.target.value);
					}}
					onKeyUp={(event) => {
						if (event.key === "Enter") {
							onApply(value);
						}
					}}
					value={value}
				/>
			</FormControl>
			<Button
				onClick={() => {
					onApply(value);
				}}
				variant="contained"
			>
				Apply
			</Button>
		</FilterPopover>
	);
}

function PhoneFilterPopover(): React.JSX.Element {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState<string>("");

	React.useEffect(() => {
		setValue((initialValue as string | undefined) ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by phone number">
			<FormControl>
				<OutlinedInput
					onChange={(event) => {
						setValue(event.target.value);
					}}
					onKeyUp={(event) => {
						if (event.key === "Enter") {
							onApply(value);
						}
					}}
					value={value}
				/>
			</FormControl>
			<Button
				onClick={() => {
					onApply(value);
				}}
				variant="contained"
			>
				Apply
			</Button>
		</FilterPopover>
	);
}

function RoleFilterPopover(): React.JSX.Element {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState<string>("");

	React.useEffect(() => {
		setValue((initialValue as string | undefined) ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by role">
			<FormControl fullWidth>
				<Select
					native
					onChange={(event) => {
						setValue(event.target.value);
					}}
					value={value}
				>
					<option value="">Any</option>
					<option value="admin">Admin</option>
					<option value="member">Member</option>
				</Select>
			</FormControl>
			<Button
				onClick={() => {
					onApply(value);
				}}
				variant="contained"
			>
				Apply
			</Button>
		</FilterPopover>
	);
}

function SearchFilterPopover(): React.JSX.Element {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState<string>("");

	React.useEffect(() => {
		setValue((initialValue as string | undefined) ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Search by name">
			<FormControl>
				<OutlinedInput
					onChange={(event) => {
						setValue(event.target.value);
					}}
					onKeyUp={(event) => {
						if (event.key === "Enter") {
							onApply(value);
						}
					}}
					placeholder="Search by name"
					value={value}
				/>
			</FormControl>
			<Button
				onClick={() => {
					onApply(value);
				}}
				variant="contained"
			>
				Apply
			</Button>
		</FilterPopover>
	);
}
