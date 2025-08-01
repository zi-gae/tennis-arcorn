import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { getMatchRecords, type MemberMatchRecord } from "@/lib/api/matches";
import { dayjs } from "@/lib/dayjs";
import { useAuth } from "@/components/auth/supabase/auth-context";
import { Modal9 } from "@/components/modals/modal-9";

interface MatchesModalProps {
	open: boolean;
	onClose: () => void;
}

export const MatchesModal: React.FC<MatchesModalProps> = ({ open, onClose }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(false); // New state for page changes
	const [matchRecords, setMatchRecords] = useState<MemberMatchRecord[]>([]);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(5);
	const [totalCount, setTotalCount] = useState(0);
	const { user } = useAuth();
	const memberId = user?.id;

	const fetchMatchRecords = useCallback(
		async (isInitialLoad = false) => {
			if (!open || !memberId) return;

			if (isInitialLoad) {
				setLoading(true);
			} else {
				setPageLoading(true);
			}

			try {
				const { data, count, error } = await getMatchRecords({
					memberId,
					page,
					pageSize,
				});

				if (error) {
					console.error("Error fetching match records:", error);
					return;
				}

				if (data) {
					setMatchRecords(data);
					setTotalCount(count || 0);
				}
			} finally {
				setLoading(false);
				setPageLoading(false);
			}
		},
		[open, memberId, page, pageSize]
	);

	useEffect(() => {
		// On initial modal open, use main loading
		if (open) {
			fetchMatchRecords(true);
		}
	}, [open]); // Remove page from dependencies

	useEffect(() => {
		// On page change, use page loading
		if (open && memberId) {
			fetchMatchRecords(false);
		}
	}, [page]);

	const getMatchResult = (record: MemberMatchRecord) => {
		const isTeam1 = record.team_no === 1;
		const team1Won = record.winner_team === 1;
		return (isTeam1 && team1Won) || (!isTeam1 && !team1Won);
	};

	const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
		setPage(newPage);
	};

	return (
		<Modal9
			open={open}
			onClose={onClose}
			title="All Match Records"
			description=""
			buttonText="Close"
			onButtonClick={onClose}
		>
			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
					<CircularProgress />
				</Box>
			) : matchRecords.length > 0 ? (
				<>
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
										sx={{ cursor: "pointer" }}
										onClick={() => {
											onClose();
											navigate(`/matches/${record.match_id}`);
										}}
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
					<Box sx={{ display: "flex", justifyContent: "center", mt: 2, position: "relative" }}>
						<Pagination
							count={Math.ceil(totalCount / pageSize)}
							page={page}
							onChange={handlePageChange}
							color="primary"
						/>
						{pageLoading && (
							<CircularProgress
								size={24}
								sx={{
									position: "absolute",
									right: -40,
									top: "50%",
									transform: "translateY(-50%)",
								}}
							/>
						)}
					</Box>
				</>
			) : (
				<Typography color="text.secondary">No match records found.</Typography>
			)}
		</Modal9>
	);
};
