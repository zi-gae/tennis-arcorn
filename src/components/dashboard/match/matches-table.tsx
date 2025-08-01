import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Trash } from "@phosphor-icons/react/dist/ssr/Trash";

import type { MemberMatchRecord } from "@/lib/api/matches";
import { deleteMatch } from "@/lib/api/matches";
import { dayjs } from "@/lib/dayjs";
import { useAuth } from "@/components/auth/supabase/auth-context";
import { Modal9 } from "@/components/modals/modal-9";

import { useMatchesSelection } from "./matches-selection-context";

interface MatchesTableProps {
	rows?: MemberMatchRecord[];
	showCheckbox?: boolean;
	onMatchDeleted?: (matchToDelete: number) => void;
}

export function MatchesTable({ rows = [], onMatchDeleted }: MatchesTableProps): React.JSX.Element {
	const { selectedAll, selectedMatches, handleSelectAll, handleSelectOne } = useMatchesSelection();
	const { member } = useAuth();
	const isAdmin = member?.role === "admin";

	const selectedKeys = Object.keys(selectedMatches);

	const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
	const [matchToDelete, setMatchToDelete] = React.useState<number | null>(null);

	const handleDeleteClick = (matchId: number) => {
		setMatchToDelete(matchId);
		setDeleteModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (matchToDelete) {
			const { success, error } = await deleteMatch(matchToDelete);
			if (success) {
				// Notify parent component to refresh data
				if (onMatchDeleted) {
					onMatchDeleted(matchToDelete);
					// Could add a success toast/notification here
					console.log(`Match #${matchToDelete} deleted successfully`);
				}
			} else {
				console.error("Failed to delete match:", error);
				// Could add error handling/notification here
			}
		}
		// Close modal regardless of outcome
		setDeleteModalOpen(false);
		setMatchToDelete(null);
	};

	const handleCloseModal = () => {
		setDeleteModalOpen(false);
		setMatchToDelete(null);
	};

	return (
		<Box sx={{ position: "relative" }}>
			<Table sx={{ minWidth: { xs: 500, sm: 500, md: 700 }, width: "100%" }}>
				<TableHead>
					<TableRow>
						{isAdmin && <TableCell padding="checkbox"></TableCell>}
						<TableCell>Name</TableCell>
						<TableCell>Match id</TableCell>
						<TableCell>Date</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Score</TableCell>
						<TableCell>Winner</TableCell>
						{isAdmin && <TableCell>Delete</TableCell>}
					</TableRow>
				</TableHead>
				<TableBody>
					{React.Children.toArray(
						rows.map((match) => {
							const isSelected = selectedMatches[match.match_id] || false;
							const matchDate = dayjs(match.match_date).format("YYYY-MM-DD");
							const isWinner = match.winner_team === match.team_no;

							return (
								<TableRow key={match.match_id + match.member_name} hover selected={isSelected}>
									{isAdmin && (
										<TableCell padding="checkbox">
											<Checkbox checked={isSelected} onChange={(event) => handleSelectOne(event, match.match_id)} />
										</TableCell>
									)}
									<TableCell>
										<Typography variant="subtitle2">{match.member_name}</Typography>
										<Typography color="text.secondary" variant="body2">
											Season {match.season_id}
										</Typography>
									</TableCell>
									<TableCell>{match.match_id}</TableCell>
									<TableCell>{matchDate}</TableCell>
									<TableCell>{match.match_type === "single" ? "Singles" : "Doubles"}</TableCell>
									<TableCell>
										{match.team1_score} - {match.team2_score}
									</TableCell>
									<TableCell>
										<Chip
											label={isWinner ? "Winner" : "Loser"}
											color={isWinner ? "success" : "secondary"}
											size="small"
										/>
									</TableCell>
									{selectedKeys.length > 0 && selectedKeys.includes(match.match_id.toString()) ? (
										<TableCell>
											<Trash
												size={24}
												style={{ cursor: "pointer" }}
												onClick={() => handleDeleteClick(match.match_id)}
											/>
										</TableCell>
									) : (
										<TableCell></TableCell>
									)}
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
			{rows.length === 0 && (
				<Box
					sx={{
						p: 2,
						textAlign: "center",
					}}
				>
					<Typography color="text.secondary" variant="subtitle2">
						No matches found
					</Typography>
				</Box>
			)}

			<Modal9
				open={deleteModalOpen}
				onClose={handleCloseModal}
				title="Delete Match"
				description={`Are you sure you want to delete match #${matchToDelete}? This action cannot be undone.`}
				buttonText="Delete Match"
				onButtonClick={handleDeleteConfirm}
			/>
		</Box>
	);
}
