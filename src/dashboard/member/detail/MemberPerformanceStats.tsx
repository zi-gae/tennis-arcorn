import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { Trophy as TrophyIcon } from "@phosphor-icons/react/dist/ssr/Trophy";

import type { MemberMatchRecord } from "@/lib/api/matches";
import type { Member } from "@/lib/api/members";

interface MemberPerformanceStatsProps {
	member: Member;
	matchRecords: MemberMatchRecord[];
	matchRecordsCount: number;
}

export const MemberPerformanceStats: React.FC<MemberPerformanceStatsProps> = ({
	member,
	matchRecords,
	matchRecordsCount,
}) => {
	const getMatchResult = (record: MemberMatchRecord) => {
		const isTeam1 = record.team_no === 1;
		const team1Won = record.winner_team === 1;
		return (isTeam1 && team1Won) || (!isTeam1 && !team1Won);
	};

	return (
		<Card>
			<CardHeader
				title="Performance Stats"
				avatar={
					<Avatar>
						<TrophyIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
			/>
			<CardContent>
				<Box sx={{ p: 2 }}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6" sx={{ fontSize: { xs: "0.875rem", md: "1.25rem" } }}>
									Total Matches
								</Typography>
								<Typography variant="h3" sx={{ mt: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
									{matchRecordsCount}
								</Typography>
							</Card>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6" sx={{ fontSize: { xs: "0.875rem", md: "1.25rem" } }}>
									Win Rate
								</Typography>
								<Typography variant="h3" sx={{ mt: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
									{matchRecords.length
										? `${Math.round((matchRecords.filter((r) => getMatchResult(r)).length / matchRecords.length) * 100)}%`
										: "N/A"}
								</Typography>
							</Card>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6" sx={{ fontSize: { xs: "0.875rem", md: "1.25rem" } }}>
									Single Class
								</Typography>
								<Typography variant="h3" sx={{ mt: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
									{member.single_class || "N/A"}
								</Typography>
							</Card>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
								<Typography variant="h6" sx={{ fontSize: { xs: "0.875rem", md: "1.25rem" } }}>
									Double Class
								</Typography>
								<Typography variant="h3" sx={{ mt: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
									{member.double_class || "N/A"}
								</Typography>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
		</Card>
	);
};
