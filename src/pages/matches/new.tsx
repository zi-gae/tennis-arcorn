import React from "react";
import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

import { MatchCreateForm } from "@/components/dashboard/match/match-create-form";

export const Page: React.FC = () => {
	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={4}>
				<Stack spacing={3}>
					<Typography variant="h4">Register Game</Typography>
				</Stack>
				<MatchCreateForm />
			</Stack>
		</Box>
	);
};
