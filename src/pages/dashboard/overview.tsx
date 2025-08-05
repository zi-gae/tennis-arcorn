import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Helmet } from "react-helmet-async";

import { Metadata } from "@/types/metadata";
import { appConfig } from "@/config/app";
import { getMemberMatchTypeRatio } from "@/lib/api/analytics";
import { useAuth } from "@/components/auth/supabase/auth-context";
import { Matches } from "@/components/dashboard/analytics/matches";
import { RankingChart } from "@/components/dashboard/analytics/ranking-chart";
import { Summary } from "@/components/dashboard/analytics/summary";

const metadata = { title: `My Matches | Matches | Dashboard | ${appConfig.name}` } satisfies Metadata;

export const Page = () => {
	const [matchData, setMatchData] = useState<{ name: string; value: number; color: string }[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		const fetchMatchData = async () => {
			if (user == null) return;
			try {
				// TODO: Replace with actual member ID from auth context or user state
				const memberId = "current-user-id";
				const matchRatio = await getMemberMatchTypeRatio(user?.id ?? memberId);

				// Transform data for the Matches component
				const formattedData = [
					{
						name: "Singles",
						value: matchRatio.singlesPercentage,
						color: "#4CAF50", // Green color
					},
					{
						name: "Doubles",
						value: matchRatio.doublesPercentage,
						color: "#2196F3", // Blue color
					},
				];

				setMatchData(formattedData);
			} catch (error) {
				console.error("Failed to fetch match ratio:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMatchData();
	}, []);

	return (
		<React.Fragment>
			<Helmet>
				<title>{metadata.title}</title>
			</Helmet>
			<Box
				sx={{
					maxWidth: "var(--Content-maxWidth)",
					m: "var(--Content-margin)",
					p: "var(--Content-padding)",
					width: "var(--Content-width)",
				}}
			>
				<Stack spacing={4}>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
						<Box sx={{ flex: "1 1 auto" }}>
							<Typography variant="h4">Overview</Typography>
						</Box>
					</Stack>
				</Stack>
				<Stack spacing={4} sx={{ mt: 3 }}>
					<Grid size={12}>
						<Summary />
					</Grid>
					{isLoading ? (
						<Typography>Loading match data...</Typography>
					) : (
						<Grid container spacing={3}>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Matches title="Singles vs Doubles Ratio" data={matchData} />
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<RankingChart title="Season ranking" type="total" />
							</Grid>
						</Grid>
					)}

					<Grid container spacing={3}>
						{/* <Grid
							size={{
								md: 4,
								xs: 12,
							}}
						>
							<RankingChart title="Season ranking" type="total" />
						</Grid> */}
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<RankingChart title="Single ranking" type="singles" />
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<RankingChart title="Double ranking" type="doubles" />
						</Grid>
					</Grid>
				</Stack>
			</Box>
		</React.Fragment>
	);
};
