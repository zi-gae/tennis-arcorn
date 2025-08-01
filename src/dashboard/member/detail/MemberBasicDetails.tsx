import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { useNavigate } from "react-router-dom";

import { paths } from "@/paths";
import type { Member } from "@/lib/api/members";
import { dayjs } from "@/lib/dayjs";
import { PropertyItem } from "@/components/core/property-item";
import { PropertyList } from "@/components/core/property-list";

interface MemberBasicDetailsProps {
	member: Member;
}

export const MemberBasicDetails: React.FC<MemberBasicDetailsProps> = ({ member }) => {
	const navigate = useNavigate();

	return (
		<Card>
			<CardHeader
				action={
					<IconButton onClick={() => navigate(paths.dashboard.members.edit(member.id))}>
						<PencilSimpleIcon />
					</IconButton>
				}
				avatar={
					<Avatar>
						<UserIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
				title="Basic details"
			/>
			<PropertyList divider={<Divider />} orientation="vertical" sx={{ "--PropertyItem-padding": "12px 24px" }}>
				{(
					[
						{
							key: "Member ID",
							value: <Chip label={member.id.substring(0, 8)} size="small" variant="soft" />,
						},
						{ key: "Name", value: member.name },
						{ key: "Email", value: member.email },
						{ key: "Phone", value: member.phone || "N/A" },
						{ key: "Status", value: member.status.charAt(0).toUpperCase() + member.status.slice(1) },
						{ key: "Role", value: member.role.charAt(0).toUpperCase() + member.role.slice(1) },
						{ key: "Ntrp", value: member.ntrp || "N/A" },
						{ key: "Joined", value: dayjs(member.joined_at).format("MMM D, YYYY") },
					] satisfies { key: string; value: React.ReactNode }[]
				).map(
					(item): React.JSX.Element => (
						<PropertyItem key={item.key} name={item.key} value={item.value} />
					)
				)}
			</PropertyList>
		</Card>
	);
};
