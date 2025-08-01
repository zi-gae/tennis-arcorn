import React, { useState } from "react";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { insertSeason } from "@/lib/api/seasons";

export const SeasonCreateForm: React.FC = () => {
	const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
	const [toDate, setToDate] = useState<Dayjs | null>(dayjs().add(1, "month"));
	const [seasonName, setSeasonName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		if (!fromDate || !toDate) {
			setError("Both dates are required.");
			return;
		}

		if (!seasonName.trim()) {
			setError("Season name is required.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const { error } = await insertSeason({
				start_date: fromDate.toISOString(),
				end_date: toDate.toISOString(),
				name: seasonName.trim(),
			});

			if (error) {
				setError("Failed to create season. Please try again.");
			} else {
				alert("Season created successfully!");
			}
		} catch {
			setError("An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardContent>
				<Stack spacing={4}>
					<Typography variant="h5">Register</Typography>
					<TextField
						fullWidth
						label="Season Name"
						value={seasonName}
						onChange={(e) => setSeasonName(e.target.value)}
						placeholder="Enter season name"
						variant="outlined"
					/>
					<Grid container spacing={2}>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<DatePicker
								format="MMM D, YYYY"
								label="From"
								value={fromDate}
								onChange={(newValue) => setFromDate(newValue)}
								sx={{ width: "100%" }}
							/>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<DatePicker
								format="MMM D, YYYY"
								label="To"
								value={toDate}
								onChange={(newValue) => setToDate(newValue)}
								sx={{ width: "100%" }}
							/>
						</Grid>
					</Grid>
					{error && <Typography color="error">{error}</Typography>}
					<Button variant="contained" onClick={handleSubmit} disabled={loading}>
						{loading ? "Submitting..." : "Create Season"}
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
};
