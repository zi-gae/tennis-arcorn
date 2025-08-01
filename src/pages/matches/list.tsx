import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";

import type { Metadata } from "@/types/metadata";
import { appConfig } from "@/config/app";
import { getMatchRecords, MemberMatchRecord } from "@/lib/api/matches";
import { MatchesFilters } from "@/components/dashboard/match/matches-filters";
import { MatchesPagination } from "@/components/dashboard/match/matches-pagination";
import { MatchesSelectionProvider } from "@/components/dashboard/match/matches-selection-context";
import { MatchesTable } from "@/components/dashboard/match/matches-table";

const metadata = { title: `List | Matches | Dashboard | ${appConfig.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {
	const [totalCount, setTotalCount] = React.useState(0);
	const [matches, setMatches] = React.useState<MemberMatchRecord[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [page, setPage] = React.useState(0);
	const [pageSize, setPageSize] = React.useState(5);

	const { memberName, seasonId, matchType, teamNo, sortDir } = useExtractSearchParams();

	const fetchMatches = React.useCallback(async () => {
		setIsLoading(true);

		try {
			const { data, count, error } = await getMatchRecords({
				memberName,
				seasonId: seasonId ? Number(seasonId) : undefined,
				matchType: matchType as "single" | "doubles" | undefined,
				teamNo: teamNo ? Number(teamNo) : undefined,
				page: page + 1, // Convert from 0-based to 1-based indexing
				pageSize,
				asc: sortDir === "asc",
			});

			if (error) {
				console.error("Error fetching matches:", error);
				return;
			}

			setMatches(data || []);
			setTotalCount(count ?? 0);
		} catch (error) {
			console.error("Error fetching matches:", error);
		} finally {
			setIsLoading(false);
		}
	}, [memberName, seasonId, matchType, teamNo, page, pageSize, sortDir]);

	React.useEffect(() => {
		fetchMatches();
	}, [fetchMatches]);

	// Handle match deletion by refreshing the data
	const handleMatchDeleted = (id: number) => {
		setMatches((prevMatches) => prevMatches.filter((match) => match.match_id !== id));
		fetchMatches();
	};

	// Handle page change
	const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setPageSize(Number.parseInt(event.target.value, 10));
		setPage(0);
	};

	console.log("@@@@ matches", matches);

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
							<Typography variant="h4">Matches</Typography>
						</Box>
					</Stack>
					<MatchesSelectionProvider matches={matches}>
						<Card>
							<MatchesFilters filters={{ memberName, seasonId, matchType, teamNo }} />
							<Divider />
							<Box sx={{ overflowX: "auto" }}>
								{isLoading ? (
									<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
										<CircularProgress />
									</Box>
								) : (
									<MatchesTable rows={matches} showCheckbox onMatchDeleted={handleMatchDeleted} />
								)}
							</Box>
							<Divider />
							<MatchesPagination
								count={totalCount}
								page={page}
								rowsPerPage={pageSize}
								onPageChange={handlePageChange}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Card>
					</MatchesSelectionProvider>
				</Stack>
			</Box>
		</React.Fragment>
	);
}

function useExtractSearchParams(): {
	memberName: string | undefined;
	seasonId: string | undefined;
	matchType: string | undefined;
	teamNo: string | undefined;
	sortDir: string | undefined;
} {
	const [searchParams] = useSearchParams();

	return {
		memberName: searchParams.get("memberName") || undefined,
		seasonId: searchParams.get("seasonId") || undefined,
		matchType: searchParams.get("matchType") || undefined,
		teamNo: searchParams.get("teamNo") || undefined,
		sortDir: searchParams.get("sortDir") || undefined,
	};
}
