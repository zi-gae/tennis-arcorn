"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery"; // 신규: 모바일 감지를 위한 import
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Minus as MinusIcon } from "@phosphor-icons/react/dist/ssr/Minus";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";

import { paths } from "@/paths";
import { Member } from "@/lib/api/members";
import { dayjs } from "@/lib/dayjs";
import { useAuth } from "@/components/auth/supabase/auth-context";
import type { ColumnDef } from "@/components/core/data-table";
import { DataTable } from "@/components/core/data-table";
import { RouterLink } from "@/components/core/link";

import { useMembersSelection } from "./members-selection-context";

export interface MembersTableProps {
	rows: Member[];
}

export function MembersTable({ rows }: MembersTableProps): React.JSX.Element {
	const { deselectAll, deselectOne, selectAll, selectOne, selected } = useMembersSelection();
	const { user, member } = useAuth();

	const isMobile = useMediaQuery("(max-width:600px)"); // 신규: 모바일 해상도인지 감지

	// 기존 컬럼 정의
	const baseColumns = [
		{
			formatter: (row): React.JSX.Element => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<Avatar>{row.name.charAt(0)}</Avatar>
					<div>
						<Link
							color="inherit"
							component={RouterLink}
							href={paths.dashboard.members.details(row.id)}
							sx={{ whiteSpace: "nowrap" }}
							variant="subtitle2"
						>
							{row.name}
						</Link>
						<Typography color="text.secondary" variant="body2">
							{row.email}
						</Typography>
					</div>
				</Stack>
			),
			name: "Name",
			width: "250px",
		},
		{
			formatter: (row): React.JSX.Element => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<Typography variant="body2">{row.single_class}</Typography>
				</Stack>
			),
			name: "Single class",
			width: "120px",
		},
		{
			formatter: (row): React.JSX.Element => (
				<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
					<Typography variant="body2">{row.double_class}</Typography>
				</Stack>
			),
			name: "Double class",
			width: "120px",
		},
		{ field: "phone", name: "Phone number", width: "150px" },
		{ field: "ntrp", name: "Ntrp", width: "100px" },
		{
			formatter(row) {
				return dayjs(row.created_at).format("YYYY-MM-DD");
			},
			name: "Joined",
			width: "150px",
		},
		{
			formatter: (row): React.JSX.Element => {
				const mapping: Record<string, { label: string; icon: React.JSX.Element }> = {
					active: { label: "Active", icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
					inactive: { label: "Inactive", icon: <MinusIcon color="var(--mui-palette-error-main)" /> },
				};
				const status = mapping[row.status] ?? { label: "Unknown", icon: null };
				return <Chip icon={status.icon} label={status.label} size="small" variant="outlined" />;
			},
			name: "Status",
			width: "100px",
		},
		{
			formatter: (row): React.JSX.Element | null => {
				if (member?.role === "admin") {
					return (
						<IconButton component={RouterLink} href={paths.dashboard.members.details(row.id)}>
							<PencilSimpleIcon />
						</IconButton>
					);
				}
				if (user?.id !== row.id) return null;
				return (
					<IconButton component={RouterLink} href={paths.dashboard.members.details(row.id)}>
						<PencilSimpleIcon />
					</IconButton>
				);
			},
			name: "Actions",
			hideName: true,
			width: "50px",
			align: "right",
		},
	] satisfies ColumnDef<Member>[];

	// 신규: 모바일일 경우 각 컬럼의 고정 width를 제거하여 자동 조정
	const displayedColumns = React.useMemo(() => {
		return isMobile ? baseColumns.map((col) => ({ ...col, width: "auto" })) : baseColumns;
	}, [isMobile]);

	return (
		<React.Fragment>
			{/* 신규: 모바일에서도 테이블이 잘 보이도록 가로 스크롤을 지원 */}
			<Box sx={{ overflowX: "auto", width: "100%" }}>
				<DataTable<Member>
					columns={displayedColumns} // 변경: baseColumns -> displayedColumns
					onDeselectAll={deselectAll}
					onDeselectOne={(_, row) => {
						deselectOne(row.id);
					}}
					onSelectAll={selectAll}
					onSelectOne={(_, row) => {
						selectOne(row.id);
					}}
					rows={rows}
					selected={selected}
				/>
			</Box>
			{rows.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No members found
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}
