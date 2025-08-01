import type * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Warning as WarningIcon } from "@phosphor-icons/react/dist/ssr/Warning";

interface Modal8Props {
	open: boolean;
	title: string;
	description: string;
	cancelText?: string;
	deactivateText: string;
	onCancelClick: () => void;
	onDeactivateClick: () => void;
	// Optionally add onClose or other props if needed
}

const style = {
	display: "flex",
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
};

export function Modal8({
	open,
	title,
	description,
	cancelText,
	deactivateText,
	onCancelClick,
	onDeactivateClick,
}: Modal8Props) {
	return (
		<Modal open={open} onClose={onCancelClick}>
			<Container maxWidth="sm" sx={style}>
				<Paper sx={{ border: "1px solid var(--mui-palette-divider)", boxShadow: "var(--mui-shadows-16)" }}>
					<Stack direction="row" spacing={2} sx={{ display: "flex", p: 3 }}>
						<Avatar sx={{ bgcolor: "var(--mui-palette-error-50)", color: "var(--mui-palette-error-main)" }}>
							<WarningIcon fontSize="var(--Icon-fontSize)" />
						</Avatar>
						<Stack spacing={3}>
							<Stack spacing={1}>
								<Typography variant="h5">{title}</Typography>
								<Typography color="text.secondary" variant="body2">
									{description}
								</Typography>
							</Stack>
							<Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
								{cancelText && (
									<Button color="secondary" onClick={onCancelClick}>
										{cancelText}
									</Button>
								)}
								<Button color="error" variant="contained" onClick={onDeactivateClick}>
									{deactivateText}
								</Button>
							</Stack>
						</Stack>
					</Stack>
				</Paper>
			</Container>
		</Modal>
	);
}
