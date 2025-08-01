import dayjs from "dayjs";

import { createClient } from "../supabase/client";

export type Season = {
	id: number;
	start_date: string;
	end_date: string;
	name: string;
};

type GetSeasonsOptions = {
	page?: number;
	pageSize?: number;
	orderBy?: {
		column: string;
		ascending: boolean;
	};
};

const supabaseClient = createClient();

export async function getSeasons(options: GetSeasonsOptions = {}): Promise<{
	data: Season[] | null;
	count: number | null;
	error: Error | null;
}> {
	try {
		const { page = 1, pageSize = 10, orderBy = { column: "start_date", ascending: false } } = options;

		// Start building query
		let query = supabaseClient.from("seasons").select("*", { count: "exact" });

		// Apply sorting
		query = query.order(orderBy.column, { ascending: orderBy.ascending });

		// Apply pagination
		if (page && pageSize) {
			const from = (page - 1) * pageSize;
			const to = from + pageSize - 1;
			query = query.range(from, to);
		}

		// Execute query
		const { data, count, error } = await query;

		return { data, count, error };
	} catch (error) {
		console.error("Error fetching seasons:", error);
		return { data: null, count: null, error: error as Error };
	}
}

// Get a single season by ID
export async function getSeasonById(id: number): Promise<{
	data: Season | null;
	error: Error | null;
}> {
	try {
		const { data, error } = await supabaseClient.from("seasons").select("*").eq("id", id).single();

		return { data, error };
	} catch (error) {
		console.error("Error fetching season:", error);
		return { data: null, error: error as Error };
	}
}

// Insert a new season
export async function insertSeason(season: Omit<Season, "id">): Promise<{
	data: Season | null;
	error: Error | null;
}> {
	try {
		const { data, error } = await supabaseClient.from("seasons").insert([season]).select().single();

		return { data, error };
	} catch (error) {
		console.error("Error inserting season:", error);
		return { data: null, error: error as Error };
	}
}

// Update an existing season
export async function updateSeason(
	id: number,
	updateData: Partial<Omit<Season, "id">>
): Promise<{
	data: Season | null;
	error: Error | null;
}> {
	try {
		const { data, error } = await supabaseClient.from("seasons").update(updateData).eq("id", id).select().single();

		return { data, error };
	} catch (error) {
		console.error("Error updating season:", error);
		return { data: null, error: error as Error };
	}
}

// Fetch seasons for dropdown selection
export async function fetchSeasons(): Promise<{ id: number; name: string }[]> {
	try {
		const { data, error } = await supabaseClient.from("seasons").select("id, start_date, end_date");

		if (error) {
			console.error("Error fetching seasons:", error);
			return [];
		}

		return (
			data?.map((season) => ({
				id: season.id,
				name: `${season.start_date} - ${season.end_date}`,
			})) || []
		);
	} catch (error) {
		console.error("Unexpected error fetching seasons:", error);
		return [];
	}
}

// Fetch seasons that include today's date
export async function fetchSeasonsForToday(): Promise<{ id: number; name: string }[]> {
	try {
		const today = dayjs().format("YYYY-MM-DD");
		const { data, error } = await supabaseClient
			.from("seasons")
			.select("id, name")
			.lte("start_date", today)
			.gte("end_date", today);

		if (error) {
			console.error("Error fetching seasons for today:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("Unexpected error fetching seasons for today:", error);
		return [];
	}
}
