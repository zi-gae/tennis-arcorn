import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ShieldWarning as ShieldWarningIcon } from "@phosphor-icons/react/dist/ssr/ShieldWarning";

interface MemberAccountManagementProps {
	onDeactivateClick: () => void;
	displayMobile?: boolean;
}

export const MemberAccountManagement: React.FC<MemberAccountManagementProps> = ({
	onDeactivateClick,
	displayMobile = false,
}) => {
	return (
		<Box sx={{ display: displayMobile ? { xs: "block", md: "none" } : { xs: "none", md: "block" } }}>
			<Card>
				<CardHeader
					avatar={
						<Avatar>
							<ShieldWarningIcon fontSize="var(--Icon-fontSize)" />
						</Avatar>
					}
					title="Account Management"
				/>
				<CardContent>
					<Stack spacing={1}>
						<div>
							<Button color="error" variant="contained" onClick={onDeactivateClick}>
								Deactivate account
							</Button>
						</div>
						<Typography color="text.secondary" variant="body2">
							A deactivated member won't be able to participate in matches and events.
						</Typography>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
};
