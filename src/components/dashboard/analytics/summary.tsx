import { useEffect, useState } from "react";
import type * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TrendDown as TrendDownIcon } from "@phosphor-icons/react/dist/ssr/TrendDown";
import { TrendUp as TrendUpIcon } from "@phosphor-icons/react/dist/ssr/TrendUp";

import {
	getMemberClassHistory,
	getMemberMatchTypeRatio,
	getMemberWinRateByMatchType,
	MemberClassHistory,
	WinRateByMatchType,
} from "@/lib/api/analytics";
import { useAuth } from "@/components/auth/supabase/auth-context";

export function Summary() {
	const { user } = useAuth();
	const [winRates, setWinRates] = useState<WinRateByMatchType>({
		singles: { winRate: 0, wins: 0, total: 0 },
		doubles: { winRate: 0, wins: 0, total: 0 },
		overall: { winRate: 0, wins: 0, total: 0 },
	});
	const [matchRatio, setMatchRatio] = useState({
		singles: 0,
		doubles: 0,
		singlesPercentage: 0,
		doublesPercentage: 0,
		totalMatches: 0,
	});
	const [classHistory, setClassHistory] = useState<MemberClassHistory>({
		history: [],
		currentSingleClass: "",
		previousSingleClass: "",
		currentDoubleClass: "",
		previousDoubleClass: "",
		error: null,
	});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadWinRateData() {
			try {
				setIsLoading(true);
				const [winRateData, matchRatioData, classHistoryData] = await Promise.all([
					getMemberWinRateByMatchType(user?.id ?? "current-user-id"),
					getMemberMatchTypeRatio(user?.id ?? "current-user-id"),
					getMemberClassHistory(user?.id ?? "current-user-id"),
				]);
				setWinRates(winRateData);
				setMatchRatio(matchRatioData);
				setClassHistory(classHistoryData);
				setError(null);
			} catch (err) {
				console.error("Failed to load win rate data:", err);
				setError("Failed to load statistics");
			} finally {
				setIsLoading(false);
			}
		}

		loadWinRateData();
	}, [user?.id]);

	// Helper function to determine if class change is an improvement
	const isClassImprovement = (previous: string, current: string): boolean => {
		// Assuming classes are ordered alphabetically with A being better than B, etc.
		return previous > current;
	};

	if (isLoading) {
		return (
			<Card>
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 3, minHeight: "200px" }}>
					<CircularProgress />
				</Box>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 3, minHeight: "200px" }}>
					<Typography color="error">{error}</Typography>
				</Box>
			</Card>
		);
	}

	return (
		<Card>
			<Box
				sx={{
					display: "grid",
					gap: 2,
					gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
					p: 3,
				}}
			>
				<Stack
					spacing={1}
					sx={{
						borderRight: { xs: "none", md: "1px solid var(--mui-palette-divider)" },
						borderBottom: { xs: "1px solid var(--mui-palette-divider)", md: "none" },
						pb: { xs: 2, md: 0 },
					}}
				>
					<Typography color="text.secondary">Singles Win Rate</Typography>
					<Typography variant="h4">
						{new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(
							winRates.singles.winRate / 100
						)}
					</Typography>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						{winRates.singles.winRate >= 50 ? (
							<TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
						) : (
							<TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
						)}
						<Typography color="text.secondary" variant="body2">
							<Typography
								color={winRates.singles.winRate >= 50 ? "success.main" : "error.main"}
								component="span"
								variant="subtitle2"
							>
								{winRates.singles.wins}
							</Typography>{" "}
							wins out of {winRates.singles.total} matches
						</Typography>
					</Stack>
				</Stack>
				<Stack
					spacing={1}
					sx={{
						borderRight: { xs: "none", md: "1px solid var(--mui-palette-divider)" },
						borderBottom: { xs: "1px solid var(--mui-palette-divider)", md: "none" },
						pb: { xs: 2, md: 0 },
					}}
				>
					<Typography color="text.secondary">Doubles Win Rate</Typography>
					<Typography variant="h4">
						{new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(
							winRates.doubles.winRate / 100
						)}
					</Typography>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						{winRates.doubles.winRate >= 50 ? (
							<TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
						) : (
							<TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
						)}
						<Typography color="text.secondary" variant="body2">
							<Typography
								color={winRates.doubles.winRate >= 50 ? "success.main" : "error.main"}
								component="span"
								variant="subtitle2"
							>
								{winRates.doubles.wins}
							</Typography>{" "}
							wins out of {winRates.doubles.total} matches
						</Typography>
					</Stack>
				</Stack>
				<Stack
					spacing={1}
					sx={{
						borderRight: { xs: "none", lg: "1px solid var(--mui-palette-divider)" },
						borderBottom: { xs: "1px solid var(--mui-palette-divider)", md: "none" },
						pb: { xs: 2, md: 0 },
					}}
				>
					<Typography color="text.secondary">Overall Win Rate</Typography>
					<Typography variant="h4">
						{new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(
							winRates.overall.winRate / 100
						)}
					</Typography>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						{winRates.overall.winRate >= 50 ? (
							<TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
						) : (
							<TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
						)}
						<Typography color="text.secondary" variant="body2">
							<Typography
								color={winRates.overall.winRate >= 50 ? "success.main" : "error.main"}
								component="span"
								variant="subtitle2"
							>
								{winRates.overall.wins}
							</Typography>{" "}
							wins out of {winRates.overall.total} matches
						</Typography>
					</Stack>
				</Stack>
				{/* <Stack
					spacing={1}
					sx={{
						borderRight: { xs: "none", md: "1px solid var(--mui-palette-divider)" },
						borderBottom: { xs: "1px solid var(--mui-palette-divider)", md: "none" },
						pb: { xs: 2, md: 0 },
					}}
				>
					<Typography color="text.secondary">Total Matches</Typography>
					<Typography variant="h4">{matchRatio.totalMatches}</Typography>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						<Typography color="text.secondary" variant="body2">
							Singles:{" "}
							<Typography component="span" variant="subtitle2">
								{matchRatio.singles}
							</Typography>
							, Doubles:{" "}
							<Typography component="span" variant="subtitle2">
								{matchRatio.doubles}
							</Typography>
						</Typography>
					</Stack>
				</Stack> */}
				<Stack spacing={1}>
					<Typography color="text.secondary">Class Changes</Typography>
					<Typography variant="h4">
						{classHistory.currentSingleClass ? classHistory.currentSingleClass : "N/A"}
					</Typography>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						{classHistory.previousSingleClass && classHistory.currentSingleClass ? (
							isClassImprovement(classHistory.previousSingleClass, classHistory.currentSingleClass) ? (
								<TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
							) : (
								<TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
							)
						) : null}
						<Typography color="text.secondary" variant="body2">
							Singles:{" "}
							<Typography
								color={
									classHistory.previousSingleClass &&
									classHistory.currentSingleClass &&
									isClassImprovement(classHistory.previousSingleClass, classHistory.currentSingleClass)
										? "success.main"
										: "error.main"
								}
								component="span"
								variant="subtitle2"
							>
								{classHistory.previousSingleClass || "N/A"} → {classHistory.currentSingleClass || "N/A"}
							</Typography>
							{", "}
							Doubles:{" "}
							<Typography
								color={
									classHistory.previousDoubleClass &&
									classHistory.currentDoubleClass &&
									isClassImprovement(classHistory.previousDoubleClass, classHistory.currentDoubleClass)
										? "success.main"
										: "error.main"
								}
								component="span"
								variant="subtitle2"
							>
								{classHistory.previousDoubleClass || "N/A"} → {classHistory.currentDoubleClass || "N/A"}
							</Typography>
						</Typography>
					</Stack>
				</Stack>
			</Box>
		</Card>
	);
}
