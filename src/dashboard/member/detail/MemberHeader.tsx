import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr/XCircle";
import { useNavigate } from "react-router-dom";

import { paths } from "@/paths";
import type { Member } from "@/lib/api/members";

interface MemberHeaderProps {
	member: Member;
}

export const MemberHeader: React.FC<MemberHeaderProps> = ({ member }) => {
	const navigate = useNavigate();

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	const getStatusIcon = (status: string) => {
		if (status === "active") {
			return <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />;
		}
		return <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" />;
	};

	return (
		<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto" }}>
				<Avatar sx={{ "--Avatar-size": "64px" }}>{getInitials(member.name)}</Avatar>
				<div>
					<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
						<Typography variant="h4">{member.name}</Typography>
						<Chip
							icon={getStatusIcon(member.status)}
							label={member.status.charAt(0).toUpperCase() + member.status.slice(1)}
							size="small"
							variant="outlined"
							color={member.status === "active" ? "success" : "default"}
						/>
					</Stack>
					<Typography color="text.secondary" variant="body1">
						{member.email}
					</Typography>
				</div>
			</Stack>
			<div>
				<Button
					startIcon={<PencilSimpleIcon />}
					variant="contained"
					onClick={() => navigate(paths.dashboard.members.edit(member.id))}
				>
					Edit
				</Button>
			</div>
		</Stack>
	);
};
