import React from "react";
import Grid from "@mui/material/Grid2";

import { MemberSelect } from "./member-select";

interface TeamMemberSelectProps {
	matchType: "single" | "doubles";
	ourTeamMembers: string[];
	opponentTeamMembers: string[];
	onOurTeamChange: (members: string[]) => void;
	onOpponentTeamChange: (members: string[]) => void;
}

export const TeamMemberSelect: React.FC<TeamMemberSelectProps> = ({
	matchType,
	ourTeamMembers,
	opponentTeamMembers,
	onOurTeamChange,
	onOpponentTeamChange,
}) => {
	return (
		<>
			<Grid size={{ md: 6, xs: 12 }}>
				<MemberSelect
					label={matchType === "single" ? "Me" : "1 Team members"}
					selectedMembers={ourTeamMembers}
					onChange={onOurTeamChange}
				/>
			</Grid>
			<Grid size={{ md: 6, xs: 12 }}>
				<MemberSelect
					label={matchType === "single" ? "Opponent" : "2 Team members"}
					selectedMembers={opponentTeamMembers}
					onChange={onOpponentTeamChange}
				/>
			</Grid>
		</>
	);
};
