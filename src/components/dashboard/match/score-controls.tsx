import React from "react";
import { Button, Grid2 as Grid, Stack, TextField, Typography } from "@mui/material";

interface ScoreControlsProps {
	isMobile: boolean;
	ourTeamScore: number;
	opponentTeamScore: number;
	setOurTeamScore: React.Dispatch<React.SetStateAction<number>>;
	setOpponentTeamScore: React.Dispatch<React.SetStateAction<number>>;
	labels?: { ourTeam: string; opponentTeam: string }; // Optional labels
}

export const ScoreControls: React.FC<ScoreControlsProps> = ({
	isMobile,
	ourTeamScore,
	opponentTeamScore,
	setOurTeamScore,
	setOpponentTeamScore,
	labels,
}) => {
	if (isMobile) {
		return (
			<Grid size={{ xs: 12 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={4}>
					<Stack alignItems="center" spacing={1}>
						<Typography variant="subtitle1">{labels?.ourTeam || "1 Team"}</Typography>
						<Stack direction="row" alignItems="center">
							<Button variant="outlined" onClick={() => setOurTeamScore((prev) => Math.max(0, prev - 1))}>
								-
							</Button>
							<Typography variant="h6" sx={{ width: "40px", textAlign: "center" }}>
								{ourTeamScore}
							</Typography>
							<Button variant="outlined" onClick={() => setOurTeamScore((prev) => prev + 1)}>
								+
							</Button>
						</Stack>
					</Stack>
					<Stack alignItems="center" spacing={1}>
						<Typography variant="subtitle1">{labels?.opponentTeam || "2 Team"}</Typography>
						<Stack direction="row" alignItems="center">
							<Button variant="outlined" onClick={() => setOpponentTeamScore((prev) => Math.max(0, prev - 1))}>
								-
							</Button>
							<Typography variant="h6" sx={{ width: "40px", textAlign: "center" }}>
								{opponentTeamScore}
							</Typography>
							<Button variant="outlined" onClick={() => setOpponentTeamScore((prev) => prev + 1)}>
								+
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Grid>
		);
	}

	return (
		<>
			<Grid size={{ md: 6, xs: 12 }}>
				<TextField
					label={labels?.ourTeam || "1팀 점수"}
					type="number"
					value={ourTeamScore}
					onChange={(e) => setOurTeamScore(Number(e.target.value))}
					fullWidth
				/>
			</Grid>
			<Grid size={{ md: 6, xs: 12 }}>
				<TextField
					label={labels?.opponentTeam || "2팀 점수"}
					type="number"
					value={opponentTeamScore}
					onChange={(e) => setOpponentTeamScore(Number(e.target.value))}
					fullWidth
				/>
			</Grid>
		</>
	);
};
