"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";

import { getMatchRecords } from "@/lib/api/matches";
import { FilterButton, FilterPopover, useFilterContext } from "@/components/core/filter-button";
import { Option } from "@/components/core/option";

export interface TabItem {
	label: string;
	value: number | string;
	count: number;
}

export function useMatchesTabs() {
	const [tabs, setTabs] = React.useState<TabItem[]>([
		{ label: "All", value: "", count: 0 },
		{ label: "Win", value: "1", count: 0 },
		{ label: "Lose", value: "2", count: 0 },
	]);

	React.useEffect(() => {
		async function fetchCounts() {
			try {
				const [totalResult, winResult, loseResult] = await Promise.all([
					getMatchRecords(),
					getMatchRecords({ teamNo: 1 }),
					getMatchRecords({ teamNo: 2 }),
				]);

				setTabs([
					{ label: "All", value: "", count: totalResult.count || 0 },
					{ label: "Win", value: "1", count: winResult.count || 0 },
					{ label: "Lose", value: "2", count: loseResult.count || 0 },
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
	memberName?: string; // Note: keeping the property name for API compatibility
	seasonId?: string;
	matchType?: string;
	teamNo?: string;
	status?: string;
}

export type SortDir = "asc" | "desc";

export interface MatchesFiltersProps {
	filters?: Filters;
	sortDir?: SortDir;
}

export function MatchesFilters({ filters = {}, sortDir: defaultSortDir = "desc" }: MatchesFiltersProps) {
	const { memberName, seasonId, matchType, teamNo, status } = filters;
	const tabs = useMatchesTabs();

	const navigate = useNavigate();
	const location = useLocation();

	// Extract the current sortDir from URL params
	const searchParams = new URLSearchParams(location.search);
	const currentSortDir = (searchParams.get("sortDir") as SortDir) || defaultSortDir;

	const updateSearchParams = React.useCallback(
		(newFilters: Filters, newSortDir: SortDir): void => {
			const searchParams = new URLSearchParams();

			if (newSortDir === "asc") {
				searchParams.set("sortDir", newSortDir);
			}

			if (newFilters.status) {
				searchParams.set("status", newFilters.status);
			}

			if (newFilters.memberName) {
				searchParams.set("memberName", newFilters.memberName);
			}

			if (newFilters.seasonId) {
				searchParams.set("seasonId", newFilters.seasonId);
			}

			if (newFilters.matchType) {
				searchParams.set("matchType", newFilters.matchType);
			}

			if (newFilters.teamNo) {
				searchParams.set("teamNo", newFilters.teamNo);
			}

			navigate(`${location.pathname}?${searchParams.toString()}`);
		},
		[navigate, location.pathname]
	);

	const handleClearFilters = React.useCallback(() => {
		updateSearchParams({}, currentSortDir);
	}, [updateSearchParams, currentSortDir]);

	const handleTeamNoChange = React.useCallback(
		(_: React.SyntheticEvent, value: string) => {
			updateSearchParams({ ...filters, teamNo: value }, currentSortDir);
		},
		[updateSearchParams, filters, currentSortDir]
	);

	const handleMemberNameChange = React.useCallback(
		(value?: string) => {
			updateSearchParams({ ...filters, memberName: value }, currentSortDir);
		},
		[updateSearchParams, filters, currentSortDir]
	);

	const handleSeasonChange = React.useCallback(
		(value?: string) => {
			updateSearchParams({ ...filters, seasonId: value }, currentSortDir);
		},
		[updateSearchParams, filters, currentSortDir]
	);

	const handleMatchTypeChange = React.useCallback(
		(value?: string) => {
			updateSearchParams({ ...filters, matchType: value }, currentSortDir);
		},
		[updateSearchParams, filters, currentSortDir]
	);

	const handleSortChange = React.useCallback(
		(event: SelectChangeEvent) => {
			const newSortDir = event.target.value as SortDir;
			updateSearchParams(filters, newSortDir);
		},
		[updateSearchParams, filters]
	);

	const hasFilters = status || memberName || seasonId || matchType || teamNo;

	return (
		<div>
			<Tabs onChange={handleTeamNoChange} sx={{ px: 3 }} value={teamNo ?? ""} variant="scrollable">
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
						displayValue={memberName}
						label="Member Name"
						onFilterApply={(value) => {
							handleMemberNameChange(value as string);
						}}
						onFilterDelete={() => {
							handleMemberNameChange();
						}}
						popover={<MemberFilterPopover />}
						value={memberName}
					/>
					<FilterButton
						displayValue={seasonId ? `Season ${seasonId}` : undefined}
						label="Season"
						onFilterApply={(value) => {
							handleSeasonChange(value as string);
						}}
						onFilterDelete={() => {
							handleSeasonChange();
						}}
						popover={<SeasonFilterPopover />}
						value={seasonId}
					/>
					<FilterButton
						displayValue={matchType === "single" ? "Singles" : matchType === "doubles" ? "Doubles" : undefined}
						label="Match Type"
						onFilterApply={(value) => {
							handleMatchTypeChange(value as string);
						}}
						onFilterDelete={() => {
							handleMatchTypeChange();
						}}
						popover={<MatchTypeFilterPopover />}
						value={matchType}
					/>
					{/* <FilterButton
						displayValue={teamNo ? `Team ${teamNo}` : undefined}
						label="Team"
						onFilterApply={(value) => {
							handleTeamNoChange(value as string);
						}}
						onFilterDelete={() => {
							handleTeamNoChange();
						}}
						popover={<TeamFilterPopover />}
						value={teamNo}
					/> */}

					{hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
				</Stack>
				<Select
					name="sort"
					onChange={handleSortChange}
					sx={{ maxWidth: "100%", width: "120px" }}
					value={currentSortDir}
				>
					<Option value="desc">Newest</Option>
					<Option value="asc">Oldest</Option>
				</Select>
			</Stack>
		</div>
	);
}

function MemberFilterPopover() {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState<string>("");

	React.useEffect(() => {
		setValue((initialValue as string | undefined) ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Member Name">
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
					placeholder="Enter Member Name"
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

function SeasonFilterPopover() {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState<string>("");

	React.useEffect(() => {
		setValue((initialValue as string | undefined) ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Season">
			<FormControl fullWidth>
				<Select
					native
					onChange={(event) => {
						setValue(event.target.value);
					}}
					value={value}
				>
					<option value="">Any</option>
					<option value="1">Season 1</option>
					<option value="2">Season 2</option>
					<option value="3">Season 3</option>
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

function MatchTypeFilterPopover() {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState<string>("");

	React.useEffect(() => {
		setValue((initialValue as string | undefined) ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Match Type">
			<FormControl fullWidth>
				<Select
					native
					onChange={(event) => {
						setValue(event.target.value);
					}}
					value={value}
				>
					<option value="">Any</option>
					<option value="single">Singles</option>
					<option value="doubles">Doubles</option>
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

function TeamFilterPopover() {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState<string>("");

	React.useEffect(() => {
		setValue((initialValue as string | undefined) ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Team">
			<FormControl fullWidth>
				<Select
					native
					onChange={(event) => {
						setValue(event.target.value);
					}}
					value={value}
				>
					<option value="">Any</option>
					<option value="1">Team 1</option>
					<option value="2">Team 2</option>
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
