import type * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";

interface Modal9Props {
	open: boolean;
	onClose: () => void;
	title: string;
	description: string;
	buttonText: string;
	onButtonClick: () => void;
	children?: React.ReactNode;
}

const style = {
	display: "flex",
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
};

export function Modal9({
	open,
	onClose,
	title,
	description,
	buttonText,
	onButtonClick,
	children,
}: Modal9Props): React.JSX.Element {
	return (
		<Modal open={open} onClose={onClose}>
			<Container maxWidth="sm" sx={style}>
				<Paper
					sx={{
						width: "100%",
						border: "1px solid var(--mui-palette-divider)",
						boxShadow: "var(--mui-shadows-16)",
						p: 3,
					}}
				>
					<Stack spacing={3}>
						<Box sx={{ display: "flex", justifyContent: "center" }}>
							<Avatar
								sx={{
									bgcolor: "var(--mui-palette-success-50)",
									color: "var(--mui-palette-success-main)",
								}}
							>
								<CheckIcon fontSize="var(--Icon-fontSize)" />
							</Avatar>
						</Box>
						<Stack spacing={1} sx={{ textAlign: "center" }}>
							<Typography variant="h5">{title}</Typography>
							{children ? (
								children
							) : (
								<Typography color="text.secondary" variant="body2">
									{description}
								</Typography>
							)}
						</Stack>
						<Button variant="contained" onClick={onButtonClick}>
							{buttonText}
						</Button>
					</Stack>
				</Paper>
			</Container>
		</Modal>
	);
}
