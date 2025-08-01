import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { FloppyDisk as FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

import type { Metadata } from "@/types/metadata";
import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { getMemberById, updateMember, type Member } from "@/lib/api/members";
import { RouterLink } from "@/components/core/link";

const metadata = { title: `Edit Member | Tennis Management | ${appConfig.name}` } satisfies Metadata;

export function Page(): React.JSX.Element {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(true);
	const [saving, setSaving] = React.useState(false);
	const [member, setMember] = React.useState<Member | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

	// Form values
	const [formValues, setFormValues] = React.useState({
		name: "",
		email: "",
		phone: "",
		status: "",
		role: "",
		single_class: "",
		double_class: "",
		ntrp: "",
	});

	// Form errors
	const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

	React.useEffect(() => {
		const fetchMember = async () => {
			if (!id) return;

			setLoading(true);

			try {
				const { data: memberData, error: memberError } = await getMemberById(id);

				if (memberError || !memberData) {
					setError("Failed to load member data");
					setLoading(false);
					return;
				}

				setMember(memberData);
				setFormValues({
					name: memberData.name || "",
					email: memberData.email || "",
					phone: memberData.phone || "",
					status: memberData.status || "",
					role: memberData.role || "",
					single_class: memberData.single_class || "",
					double_class: memberData.double_class || "",
					ntrp: memberData.ntrp || "",
				});

				setLoading(false);
			} catch (error) {
				console.error("Unexpected error:", error);
				setError("An unexpected error occurred");
				setLoading(false);
			}
		};

		fetchMember();
	}, [id]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
		const { name, value } = e.target;
		if (!name) return;

		setFormValues((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when field is modified
		if (formErrors[name]) {
			setFormErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const validateForm = (): boolean => {
		const errors: Record<string, string> = {};

		// Required field validation
		if (!formValues.name.trim()) errors.name = "Name is required";
		if (!formValues.email.trim()) errors.email = "Email is required";

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (formValues.email && !emailRegex.test(formValues.email)) {
			errors.email = "Invalid email format";
		}

		// Phone format validation (optional field)
		if (formValues.phone && !/^[0-9+\-() ]*$/.test(formValues.phone)) {
			errors.phone = "Invalid phone number format";
		}

		// Required fields for status and role
		if (!formValues.status) errors.status = "Status is required";
		if (!formValues.role) errors.role = "Role is required";

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!id || !validateForm()) return;

		setSaving(true);
		setSuccessMessage(null);
		setError(null);

		try {
			const { data, error: updateError } = await updateMember(id, formValues);

			if (updateError || !data) {
				setError(updateError?.message || "Failed to update member");
				setSaving(false);
				return;
			}

			setMember(data);
			setSuccessMessage("Member updated successfully");
			setSaving(false);

			// Scroll to top to show success message
			window.scrollTo(0, 0);
		} catch (error) {
			console.error("Error updating member:", error);
			setError("An unexpected error occurred");
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (!member) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color="error" variant="h5">
					{error || "Member not found"}
				</Typography>
				<Button
					sx={{ mt: 2 }}
					variant="outlined"
					startIcon={<ArrowLeftIcon />}
					onClick={() => navigate(paths.dashboard.members.details(id || ""))}
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
								href={paths.dashboard.members.details(id || "")}
								sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
								variant="subtitle2"
							>
								<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
								Back to Member Details
							</Link>
						</div>
						<Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
							<div>
								<Typography variant="h4">Edit Member</Typography>
								<Typography color="text.secondary" variant="body1">
									Update {member.name}'s information
								</Typography>
							</div>
						</Stack>
					</Stack>

					{successMessage && (
						<Alert severity="success" onClose={() => setSuccessMessage(null)}>
							{successMessage}
						</Alert>
					)}

					{error && (
						<Alert severity="error" onClose={() => setError(null)}>
							{error}
						</Alert>
					)}

					<form onSubmit={handleSubmit}>
						<Card>
							<CardHeader title="Basic Information" />
							<Divider />
							<CardContent>
								<Grid container spacing={3}>
									<Grid size={{ xs: 12, md: 6 }}>
										<TextField
											fullWidth
											label="Name"
											name="name"
											required
											value={formValues.name}
											onChange={handleInputChange}
											error={!!formErrors.name}
											helperText={formErrors.name}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<TextField
											fullWidth
											label="Email"
											name="email"
											required
											type="email"
											value={formValues.email}
											onChange={handleInputChange}
											error={!!formErrors.email}
											helperText={formErrors.email}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<TextField
											fullWidth
											label="Phone"
											name="phone"
											value={formValues.phone}
											onChange={handleInputChange}
											error={!!formErrors.phone}
											helperText={formErrors.phone}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<TextField
											fullWidth
											label="Ntrp"
											name="ntrp"
											value={formValues.ntrp}
											onChange={handleInputChange}
											error={!!formErrors.ntrp}
											helperText={formErrors.ntrp}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<FormControl fullWidth error={!!formErrors.status}>
											<InputLabel id="status-label">Status</InputLabel>
											<Select
												labelId="status-label"
												name="status"
												value={formValues.status}
												label="Status"
												onChange={handleInputChange}
												required
											>
												<MenuItem value="active">Active</MenuItem>
												<MenuItem value="inactive">Inactive</MenuItem>
											</Select>
											{formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
										</FormControl>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<FormControl fullWidth error={!!formErrors.role}>
											<InputLabel id="role-label">Role</InputLabel>
											<Select
												labelId="role-label"
												name="role"
												value={formValues.role}
												label="Role"
												onChange={handleInputChange}
												required
											>
												<MenuItem value="member">Member</MenuItem>
												<MenuItem value="coach">Coach</MenuItem>
												<MenuItem value="admin">Admin</MenuItem>
											</Select>
											{formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
										</FormControl>
									</Grid>
								</Grid>
							</CardContent>
							<Divider />
							{/* <CardHeader title="Playing Preferences" />
							<CardContent>
								<Grid container spacing={3}>
									<Grid size={{ xs: 12, md: 6 }}>
										<TextField
											fullWidth
											label="Singles Class"
											name="single_class"
											value={formValues.single_class}
											onChange={handleInputChange}
											placeholder="e.g. A, B, C"
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<TextField
											fullWidth
											label="Doubles Class"
											name="double_class"
											value={formValues.double_class}
											onChange={handleInputChange}
											placeholder="e.g. A, B, C"
										/>
									</Grid>
								</Grid>
							</CardContent> */}
							<Divider />
							<Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
								<Button
									type="button"
									variant="outlined"
									onClick={() => navigate(paths.dashboard.members.list)}
									sx={{ mr: 2 }}
								>
									Cancel
								</Button>
								<Button type="submit" variant="contained" startIcon={<FloppyDiskIcon />} disabled={saving}>
									{saving ? "Saving..." : "Save Changes"}
								</Button>
							</Box>
						</Card>
					</form>
				</Stack>
			</Box>
		</React.Fragment>
	);
}
