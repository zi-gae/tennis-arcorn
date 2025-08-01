import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Trophy as TrophyIcon } from "@phosphor-icons/react/dist/ssr/Trophy";
import { useNavigate } from "react-router-dom";

import type { MemberMatchRecord } from "@/lib/api/matches";
import { dayjs } from "@/lib/dayjs";

interface MemberRecentMatchesProps {
	matchRecords: MemberMatchRecord[];
	onViewAllClick: () => void;
}

export const MemberRecentMatches: React.FC<MemberRecentMatchesProps> = ({ matchRecords, onViewAllClick }) => {
	const navigate = useNavigate();

	const getMatchResult = (record: MemberMatchRecord) => {
		const isTeam1 = record.team_no === 1;
		const team1Won = record.winner_team === 1;
		return (isTeam1 && team1Won) || (!isTeam1 && !team1Won);
	};

	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar>
						<TrophyIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
				title="Recent Matches"
				action={
					<Button color="secondary" onClick={onViewAllClick}>
						View All
					</Button>
				}
			/>
			<CardContent>
				{matchRecords.length > 0 ? (
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Date</TableCell>
									<TableCell>Type</TableCell>
									<TableCell>Score</TableCell>
									<TableCell>Result</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{matchRecords.map((record) => (
									<TableRow
										key={record.match_id}
										hover
										sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
										onClick={() => navigate(`/matches/${record.match_id}`)}
									>
										<TableCell>{dayjs(record.match_date).format("MMM D, YYYY")}</TableCell>
										<TableCell>{record.match_type.charAt(0).toUpperCase() + record.match_type.slice(1)}</TableCell>
										<TableCell>
											{record.team1_score} - {record.team2_score}
										</TableCell>
										<TableCell>
											<Chip
												label={getMatchResult(record) ? "Won" : "Lost"}
												color={getMatchResult(record) ? "success" : "error"}
												size="small"
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Box sx={{ p: 2, textAlign: "center" }}>
						<Typography color="text.secondary">No match records found for this member.</Typography>
					</Box>
				)}
			</CardContent>
		</Card>
	);
};
