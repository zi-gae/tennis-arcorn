import * as React from "react";
import { MatchesModal } from "@/dashboard/member/detail/MatchesModal";
import { MemberAccountManagement } from "@/dashboard/member/detail/MemberAccountManagement";
import { MemberBasicDetails } from "@/dashboard/member/detail/MemberBasicDetails";
// Import our new components
import { MemberHeader } from "@/dashboard/member/detail/MemberHeader";
import { MemberPerformanceStats } from "@/dashboard/member/detail/MemberPerformanceStats";
import { MemberRecentMatches } from "@/dashboard/member/detail/MemberRecentMatches";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

import type { Metadata } from "@/types/metadata";
import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { getMatchRecords, type MemberMatchRecord } from "@/lib/api/matches";
import { getMemberById, updateMember, type Member } from "@/lib/api/members";
import { useAuth } from "@/components/auth/supabase/auth-context";
import { RouterLink } from "@/components/core/link";
import { Modal8 } from "@/components/modals/modal-8";

const metadata = { title: `Member Details | Tennis Management | ${appConfig.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(true);
	const [member, setMember] = React.useState<Member | null>(null);
	const [matchRecords, setMatchRecords] = React.useState<MemberMatchRecord[]>([]);
	const [matchRecordsCount, setMatchRecordsCount] = React.useState<number>(0);
	const [error, setError] = React.useState<string | null>(null);
	const [deactivateModalOpen, setDeactivateModalOpen] = React.useState(false);
	const [viewAllModalOpen, setViewAllModalOpen] = React.useState(false);
	const [allMatchRecords, setAllMatchRecords] = React.useState<MemberMatchRecord[]>([]);
	const [allLoading, setAllLoading] = React.useState(false);
	const { member: currentMember } = useAuth();

	React.useEffect(() => {
		const fetchData = async () => {
			if (!id) return;

			setLoading(true);

			try {
				// Fetch member data
				const { data: memberData, error: memberError } = await getMemberById(id);

				if (memberError || !memberData) {
					setError("Failed to load member data");
					setLoading(false);
					return;
				}

				setMember(memberData);

				// Fetch match records for this member
				const {
					data: matchData,
					count,
					error: matchError,
				} = await getMatchRecords({
					memberId: id,
					pageSize: 5,
				});

				if (matchError || !matchData) {
					console.error("Error loading match records:", matchError);
				} else {
					setMatchRecords(matchData);
					if (count) setMatchRecordsCount(count);
				}

				setLoading(false);
			} catch (error) {
				console.error("Unexpected error:", error);
				setError("An unexpected error occurred");
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	const openDeactivateModal = () => {
		setDeactivateModalOpen(true);
	};

	const confirmDeactivate = async () => {
		if (!member) return;
		try {
			const { data, error } = await updateMember(member.id, { status: "inactive" });
			if (error || !data) {
				setError("Failed to deactivate account");
			} else {
				setMember(data);
			}
		} catch (e) {
			setError("An unexpected error occurred");
		}
		setDeactivateModalOpen(false);
	};

	const cancelDeactivate = () => {
		setDeactivateModalOpen(false);
	};

	const openViewAllModal = async () => {
		if (!id) return;
		setViewAllModalOpen(true);
		setAllLoading(true);
		try {
			const { data: allData, error: allError } = await getMatchRecords({ memberId: id, pageSize: 1000 });
			if (allError || !allData) {
				setAllMatchRecords([]);
			} else {
				setAllMatchRecords(allData);
			}
		} catch (e) {
			console.error(e);
		}
		setAllLoading(false);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error || !member) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color="error" variant="h5">
					{error || "Member not found"}
				</Typography>
				<Button
					sx={{ mt: 2 }}
					variant="outlined"
					startIcon={<ArrowLeftIcon />}
					onClick={() => navigate(paths.dashboard.members.list)}
				>
					Back to Members List
				</Button>
			</Box>
		);
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>{metadata.title}</title>
			</Helmet>
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
						<div>
							<Link
								color="text.primary"
								component={RouterLink}
								href={paths.dashboard.members.list}
								sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
								variant="subtitle2"
							>
								<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
								Members
							</Link>
						</div>
						<MemberHeader member={member} />
					</Stack>
					<Grid container spacing={4}>
						<Grid
							size={{
								lg: 4,
								xs: 12,
							}}
						>
							<Stack spacing={4}>
								<MemberBasicDetails member={member} />
								{currentMember?.role === "admin" && <MemberAccountManagement onDeactivateClick={openDeactivateModal} />}
							</Stack>
						</Grid>
						<Grid
							size={{
								lg: 8,
								xs: 12,
							}}
						>
							<Stack spacing={4}>
								<MemberRecentMatches matchRecords={matchRecords} onViewAllClick={openViewAllModal} />
								<MemberPerformanceStats
									member={member}
									matchRecords={matchRecords}
									matchRecordsCount={matchRecordsCount}
								/>
							</Stack>
						</Grid>
					</Grid>
					{currentMember?.role === "admin" && (
						<MemberAccountManagement onDeactivateClick={openDeactivateModal} displayMobile={true} />
					)}
				</Stack>
			</Box>
			<Modal8
				open={deactivateModalOpen}
				title="Deactivate Account?"
				description="Are you sure you want to deactivate this account?"
				cancelText="Cancel"
				deactivateText="Deactivate"
				onCancelClick={cancelDeactivate}
				onDeactivateClick={confirmDeactivate}
			/>
			<MatchesModal open={viewAllModalOpen} onClose={() => setViewAllModalOpen(false)} />
		</React.Fragment>
	);
}
