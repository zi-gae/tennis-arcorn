import React, { useEffect, useState } from "react";
import {
	Button,
	Card,
	CardContent,
	MenuItem,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";

import { paths } from "@/paths";
import { recordMatch } from "@/lib/api/matches";
import { fetchSeasonsForToday } from "@/lib/api/seasons";

import { MemberSelect } from "./member-select";
import { ScoreControls } from "./score-controls";
import { TeamMemberSelect } from "./team-member-select";

export const MatchCreateForm: React.FC = () => {
	const [matchDate, setMatchDate] = useState<Dayjs | null>(dayjs());
	const [matchType, setMatchType] = useState<"single" | "doubles">("single");
	const [ourTeamMembers, setOurTeamMembers] = useState<string[]>([]);
	const [opponentTeamMembers, setOpponentTeamMembers] = useState<string[]>([]);
	const [ourTeamScore, setOurTeamScore] = useState<number>(0);
	const [opponentTeamScore, setOpponentTeamScore] = useState<number>(0);
	const [gameNumber, setGameNumber] = useState<number>(1);
	const [seasonId, setSeasonId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [seasons, setSeasons] = useState<{ id: number; name: string }[]>([]);
	const navigate = useNavigate();

	const isMobile = useMediaQuery("(max-width:600px)");

	useEffect(() => {
		const loadSeasons = async () => {
			const fetchedSeasons = await fetchSeasonsForToday();
			setSeasons(fetchedSeasons);
		};
		loadSeasons();
	}, []);

	const handleOurTeamMembersChange = (members: string[]) => {
		if (matchType === "single" && members.length > 1) {
			setOurTeamMembers(members.slice(-1)); // Keep only the last selected member
		} else if (matchType === "doubles" && members.length > 2) {
			setOurTeamMembers(members.slice(-2)); // Keep only the last two selected members
		} else {
			setOurTeamMembers(members);
		}
	};

	const handleOpponentTeamMembersChange = (members: string[]) => {
		if (matchType === "single" && members.length > 1) {
			setOpponentTeamMembers(members.slice(-1)); // Keep only the last selected member
		} else if (matchType === "doubles" && members.length > 2) {
			setOpponentTeamMembers(members.slice(-2)); // Keep only the last two selected members
		} else {
			setOpponentTeamMembers(members);
		}
	};

	const handleSubmit = async () => {
		if (!matchDate || !seasonId || ourTeamMembers.length === 0 || opponentTeamMembers.length === 0) {
			setError("All fields are required.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const { error } = await recordMatch({
				matchType,
				ourTeamMembers,
				opponentTeamMembers,
				ourTeamScore,
				opponentTeamScore,
				gameNumber,
				seasonId,
				matchDate: matchDate.toISOString(),
			});

			if (error) {
				setError("Failed to record match. Please try again.");
			} else {
				alert("Match recorded successfully!");
				navigate(paths.dashboard.matches.list);
			}
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardContent>
				<Stack spacing={4}>
					<Typography variant="h5">Match Record</Typography>
					<Grid container spacing={2}>
						<Grid size={{ md: 6, xs: 12 }}>
							{isMobile ? (
								<ToggleButtonGroup
									value={matchType}
									exclusive
									onChange={(e, newType) => {
										if (newType !== null) {
											setMatchType(newType);
											setOurTeamMembers([]);
											setOpponentTeamMembers([]);
										}
									}}
									fullWidth
								>
									<ToggleButton value="single" color="primary">
										Singles
									</ToggleButton>
									<ToggleButton value="doubles" color="primary">
										Doubles
									</ToggleButton>
								</ToggleButtonGroup>
							) : (
								<TextField
									select
									label="Match Type"
									value={matchType}
									onChange={(e) => {
										setMatchType(e.target.value as "single" | "doubles");
										setOurTeamMembers([]);
										setOpponentTeamMembers([]);
									}}
									fullWidth
								>
									<MenuItem value="single">Singles</MenuItem>
									<MenuItem value="doubles">Doubles</MenuItem>
								</TextField>
							)}
						</Grid>
						<Grid size={{ md: 6, xs: 12 }}>
							<DatePicker
								format="YYYY-MM-DD"
								label="Match Date"
								value={matchDate}
								onChange={(newValue) => setMatchDate(newValue)}
								sx={{ width: "100%" }}
							/>
						</Grid>
						<TeamMemberSelect
							matchType={matchType}
							ourTeamMembers={ourTeamMembers}
							opponentTeamMembers={opponentTeamMembers}
							onOurTeamChange={handleOurTeamMembersChange}
							onOpponentTeamChange={handleOpponentTeamMembersChange}
						/>
						<ScoreControls
							isMobile={isMobile}
							ourTeamScore={ourTeamScore}
							opponentTeamScore={opponentTeamScore}
							setOurTeamScore={setOurTeamScore}
							setOpponentTeamScore={setOpponentTeamScore}
							labels={matchType === "single" ? { ourTeam: "Me", opponentTeam: "Opponent" } : undefined}
						/>
						<Grid size={{ md: 6, xs: 12 }}>
							<TextField
								select
								label="Season"
								value={seasonId || ""}
								onChange={(e) => setSeasonId(Number(e.target.value))}
								fullWidth
							>
								{seasons.map((season) => (
									<MenuItem key={season.id} value={season.id}>
										{season.name}
									</MenuItem>
								))}
							</TextField>
						</Grid>
					</Grid>
					{error && <Typography color="error">{error}</Typography>}
					<Button variant="contained" onClick={handleSubmit} disabled={loading}>
						{loading ? "Submitting..." : "Record Match"}
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
};
