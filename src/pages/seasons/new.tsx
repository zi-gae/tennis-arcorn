import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/components/auth/supabase/auth-context";
import { SeasonCreateForm } from "@/components/dashboard/seasons/season-create-form";
import { Modal8 } from "@/components/modals/modal-8";

export const Page = () => {
	const { member } = useAuth();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (member && member.role !== "admin") {
			setIsModalOpen(true);
		}
	}, [member]);

	const handleCancel = () => {
		setIsModalOpen(false);
		navigate("/");
	};

	const handleRedirect = () => {
		setIsModalOpen(false);
		navigate("/");
	};

	if (member == null) {
		return null;
	}

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Modal8
				open={isModalOpen}
				title="Access Restricted"
				description="This page is accessible only to administrators."
				deactivateText="Go to Home"
				onCancelClick={handleCancel}
				onDeactivateClick={handleRedirect}
			/>
			<Stack spacing={4}>
				{member.role === "admin" && (
					<>
						<Stack spacing={3}>
							<Typography variant="h4">Register Season</Typography>
						</Stack>
						<SeasonCreateForm />
					</>
				)}
			</Stack>
		</Box>
	);
};
