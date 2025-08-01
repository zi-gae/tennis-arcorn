"use client";

import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getDoublesRanking, getSeasonRanking, getSinglesRanking } from "@/lib/api/analytics";
import { getSeasons } from "@/lib/api/seasons";

interface RankingChartProps {
	title: string;
	type: "singles" | "doubles" | "total";
}

export function RankingChart({ title, type }: RankingChartProps) {
	const [seasons, setSeasons] = useState<{ id: number; name: string }[]>([]);
	const [selectedSeason, setSelectedSeason] = useState<number | "">("");
	const [rankings, setRankings] = useState<{ score: number; name: string }[]>([]);

	useEffect(() => {
		getSeasons({ page: 1, pageSize: 100, orderBy: { column: "start_date", ascending: false } }).then((result) => {
			if (result.data) {
				setSeasons(result.data.map((season) => ({ id: season.id, name: season.name })));
				if (result.data.length > 0) setSelectedSeason(result.data[0].id);
			}
		});
	}, []);

	useEffect(() => {
		if (type === "singles" && selectedSeason) {
			getSinglesRanking(selectedSeason.toString()).then((result) => {
				if (result) {
					setRankings(
						result.map(({ season, name, score }) => ({
							score,
							name,
						}))
					);
				}
			});
		}

		if (type === "doubles" && selectedSeason) {
			getDoublesRanking(selectedSeason.toString()).then((result) => {
				if (result) {
					setRankings(
						result.map(({ season, name, score }) => ({
							score,
							name,
						}))
					);
				}
			});
		}
		if (type === "total" && selectedSeason) {
			getSeasonRanking(selectedSeason.toString()).then((result) => {
				if (result) {
					setRankings(
						result.map(({ season, name, score }) => ({
							score,
							name,
						}))
					);
				}
			});
		}
	}, [selectedSeason]);

	return (
		<Card>
			<CardHeader
				title={title}
				action={
					<Select
						value={selectedSeason}
						onChange={(e) => setSelectedSeason(Number(e.target.value))}
						displayEmpty
						sx={{ minWidth: 120 }}
					>
						{seasons.map((season) => (
							<MenuItem key={season.id} value={season.id}>
								{season.name}
							</MenuItem>
						))}
					</Select>
				}
			/>
			<CardContent>
				{rankings.length > 0 ? (
					<ResponsiveContainer height={300}>
						<BarChart data={rankings} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
							<CartesianGrid horizontal={false} strokeDasharray="2 4" />
							<XAxis type="number" axisLine={false} tickLine={false} />
							<YAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
							<Bar dataKey="score" fill="var(--mui-palette-primary-main)" barSize={12} radius={[5, 5, 5, 5]} />
							<Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
						</BarChart>
					</ResponsiveContainer>
				) : (
					<Typography color="text.secondary">No rankings available for the selected season.</Typography>
				)}
			</CardContent>
		</Card>
	);
}

interface TooltipContentProps {
	active?: boolean;
	payload?: { fill: string; name: string; value: number }[];
	label?: string;
}

function TooltipContent({ active, payload }: TooltipContentProps): React.JSX.Element | null {
	if (!active) {
		return null;
	}

	return (
		<Paper sx={{ border: "1px solid var(--mui-palette-divider)", boxShadow: "var(--mui-shadows-16)", p: 1 }}>
			<Stack spacing={2}>
				{payload?.map(
					(entry): React.JSX.Element => (
						<Stack direction="row" key={entry.name} spacing={3} sx={{ alignItems: "center" }}>
							<Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: "1 1 auto" }}>
								<Box sx={{ bgcolor: entry.fill, borderRadius: "2px", height: "8px", width: "8px" }} />
								<Typography sx={{ whiteSpace: "nowrap" }}>{entry.name}</Typography>
							</Stack>
							<Typography color="text.secondary" variant="body2">
								{entry.value}
							</Typography>
						</Stack>
					)
				)}
			</Stack>
		</Paper>
	);
}
