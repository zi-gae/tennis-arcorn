import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";

import type { Metadata } from "@/types/metadata";
import { appConfig } from "@/config/app";
import { getMembers, Member } from "@/lib/api/members";
import { MembersFilters } from "@/components/dashboard/member/members-filters";
import { MembersPagination } from "@/components/dashboard/member/members-pagination";
import { MembersSelectionProvider } from "@/components/dashboard/member/members-selection-context";
import { MembersTable } from "@/components/dashboard/member/members-table";

const metadata = { title: `List | Members | Dashboard | ${appConfig.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {
	const [totalCount, setTotalCount] = React.useState(0);
	const [members, setMembers] = React.useState<Member[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [page, setPage] = React.useState(0);
	const [pageSize, setPageSize] = React.useState(5);

	const { email, phone, sortDir, status, name, role } = useExtractSearchParams();

	// Fetch members when filters change
	React.useEffect(() => {
		const fetchMembers = async () => {
			setIsLoading(true);

			try {
				const orderBy = {
					column: "created_at",
					ascending: sortDir === "asc",
				};

				const searchQuery = email || phone || name || role || undefined;

				const { data, count, error } = await getMembers({
					page: page + 1, // Convert from 0-based to 1-based indexing
					pageSize,
					status,
					searchQuery,
					orderBy,
				});

				if (error) {
					console.error("Error fetching members:", error);
					return;
				}

				// Transform data to match the expected format for the table
				const formattedMembers =
					data?.map((member) => ({
						id: member.id,
						name: member.name,
						avatar: "/assets/avatar-1.png", // Default avatar
						email: member.email,
						phone: member.phone,
						status: member.status,
						createdAt: new Date(member.created_at),
						joinedAt: new Date(member.joined_at),
						role: member.role,
						ntrp: member.ntrp, // Ensure 'ntrp' is included
						single_class: member.single_class, // Ensure 'single_class' is included
						double_class: member.double_class, // Ensure 'double_class' is included
						created_at: member.created_at, // Include original field
						joined_at: member.joined_at, // Include original field
					})) || [];

				setMembers(formattedMembers);
				setTotalCount(count || 0);
			} catch (error) {
				console.error("Error fetching members:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMembers();
	}, [email, phone, sortDir, status, page, pageSize, name, role]);

	// Handle page change
	const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setPageSize(Number.parseInt(event.target.value, 10));
		setPage(0);
	};
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
					<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
						<Box sx={{ flex: "1 1 auto" }}>
							<Typography variant="h4">Members</Typography>
						</Box>
					</Stack>
					<MembersSelectionProvider members={members}>
						<Card>
							<MembersFilters filters={{ email, phone, status, role, name }} sortDir={sortDir} />
							<Divider />
							<Box sx={{ overflowX: "auto" }}>
								{isLoading ? (
									<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
										<CircularProgress />
									</Box>
								) : (
									<MembersTable rows={members} />
								)}
							</Box>
							<Divider />
							<MembersPagination
								count={totalCount}
								page={page}
								rowsPerPage={pageSize}
								onPageChange={handlePageChange}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Card>
					</MembersSelectionProvider>
				</Stack>
			</Box>
		</React.Fragment>
	);
}

function useExtractSearchParams(): {
	email: string | undefined;
	phone: string | undefined;
	sortDir: "asc" | "desc" | undefined;
	status: string | undefined;
	name: string | undefined;
	role: string | undefined;
} {
	const [searchParams] = useSearchParams();

	return {
		email: searchParams.get("email") || undefined,
		phone: searchParams.get("phone") || undefined,
		sortDir: (searchParams.get("sortDir") || undefined) as "asc" | "desc" | undefined,
		status: searchParams.get("status") || undefined,
		name: searchParams.get("name") || undefined,
		role: searchParams.get("role") || undefined,
	};
}
