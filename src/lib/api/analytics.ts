import { createClient } from "../supabase/client";

interface MatchRatio {
	singles: number;
	doubles: number;
	singlesPercentage: number;
	doublesPercentage: number;
	totalMatches: number;
}

interface MatchTypeCount {
	singles: number;
	doubles: number;
	total: number;
}

export interface WinRateByMatchType {
	singles: {
		wins: number;
		total: number;
		winRate: number;
	};
	doubles: {
		wins: number;
		total: number;
		winRate: number;
	};
	overall: {
		wins: number;
		total: number;
		winRate: number;
	};
}

const supabaseClient = createClient();

/**
 * Get the singles to doubles match ratio for a specific member
 * @param memberId - The ID of the member
 * @returns Object containing match counts and percentages
 */
export async function getMemberMatchTypeRatio(memberId: string): Promise<MatchRatio> {
	const { data, error } = await supabaseClient.from("v_match_records").select("match_type").eq("member_id", memberId);

	if (error) {
		console.error("Error fetching match data:", error);
		throw error;
	}

	// Count singles and doubles matches
	const singlesMatches = data?.filter((match) => match.match_type === "single").length || 0;
	const doublesMatches = data?.filter((match) => match.match_type === "doubles").length || 0;
	const totalMatches = singlesMatches + doublesMatches;

	// Calculate percentages
	const singlesPercentage = totalMatches > 0 ? (singlesMatches / totalMatches) * 100 : 0;
	const doublesPercentage = totalMatches > 0 ? (doublesMatches / totalMatches) * 100 : 0;

	return {
		singles: singlesMatches,
		doubles: doublesMatches,
		singlesPercentage: Number(singlesPercentage.toFixed(2)),
		doublesPercentage: Number(doublesPercentage.toFixed(2)),
		totalMatches,
	};
}

/**
 * Get count of matches grouped by match type
 * @returns Object containing match counts by type
 */
export async function getMatchCountByType(): Promise<MatchTypeCount> {
	const { data, error } = await supabaseClient.from("v_match_records").select("match_type, team_no");

	if (error) {
		console.error("Error fetching match data:", error);
		throw error;
	}

	// Count matches by type
	const singlesMatches = data?.filter((match) => match.match_type === "single").length || 0;
	const doublesMatches = data?.filter((match) => match.match_type === "doubles").length || 0;
	const totalMatches = singlesMatches + doublesMatches;

	return {
		singles: singlesMatches,
		doubles: doublesMatches,
		total: totalMatches,
	};
}

/**
 * Get win rates by match type for a specific member
 * @param memberId - The ID of the member
 * @returns Object containing win rates by match type
 */
export async function getMemberWinRateByMatchType(memberId: string): Promise<WinRateByMatchType> {
	// Convert memberId to number if it's numeric

	const { data, error } = await supabaseClient
		.from("v_match_records")
		.select("match_type, team_no, winner_team")
		.eq("member_id", memberId);

	if (error) {
		console.error("Error fetching match data:", error);
		throw error;
	}

	// Count wins and total matches by type
	let singlesWins = 0;
	let singlesTotal = 0;
	let doublesWins = 0;
	let doublesTotal = 0;

	data?.forEach((match) => {
		if (match.match_type === "single") {
			singlesTotal++;
			if (match.team_no === match.winner_team) {
				singlesWins++;
			}
		} else if (match.match_type === "doubles") {
			doublesTotal++;
			if (match.team_no === match.winner_team) {
				doublesWins++;
			}
		}
	});

	const totalWins = singlesWins + doublesWins;
	const totalMatches = singlesTotal + doublesTotal;

	// Calculate win rates
	const singlesWinRate = singlesTotal > 0 ? Number(((singlesWins / singlesTotal) * 100).toFixed(2)) : 0;
	const doublesWinRate = doublesTotal > 0 ? Number(((doublesWins / doublesTotal) * 100).toFixed(2)) : 0;
	const overallWinRate = totalMatches > 0 ? Number(((totalWins / totalMatches) * 100).toFixed(2)) : 0;

	return {
		singles: {
			wins: singlesWins,
			total: singlesTotal,
			winRate: singlesWinRate,
		},
		doubles: {
			wins: doublesWins,
			total: doublesTotal,
			winRate: doublesWinRate,
		},
		overall: {
			wins: totalWins,
			total: totalMatches,
			winRate: overallWinRate,
		},
	};
}

/**
 * Get season rankings by specified points type
 * @param seasonId - The ID of the season
 * @param pointsType - The type of points to rank by ('total', 'single', or 'doubles')
 * @returns Array of rankings with rank, score, member name, and season name
 */
export async function getPointsRanking(
	seasonId: string,
	pointsType: "total" | "single" | "doubles" = "total"
): Promise<{ rank: number; score: number; name: string; season: string }[]> {
	// Map the points type to the actual column name
	const pointsColumn =
		pointsType === "total" ? "total_points" : pointsType === "single" ? "single_points" : "double_points";

	const { data, error } = await supabaseClient
		.from("season_ranking")
		.select(
			`
			${pointsColumn},
			member_id,
			members(name)
		`
		)
		.eq("season_id", seasonId)
		.order(pointsColumn, { ascending: false });

	if (error) {
		console.error(`Error fetching ${pointsType} rankings:`, error);
		throw error;
	}

	// Get the season name
	const { data: seasonData, error: seasonError } = await supabaseClient
		.from("seasons")
		.select("name")
		.eq("id", seasonId)
		.single();

	if (seasonError) {
		console.error("Error fetching season name:", seasonError);
		throw seasonError;
	}

	const seasonName = seasonData?.name || "";

	// Map the data and assign ranks
	return (
		data?.map((row, index) => ({
			score: row[pointsColumn as keyof typeof row],
			rank: index + 1,
			name: row.members?.name || "",
			season: seasonName,
		})) || []
	);
}

// For backward compatibility, keep the original functions but implement them using the new unified function
export async function getSeasonRanking(
	seasonId: string
): Promise<{ rank: number; score: number; name: string; season: string }[]> {
	return getPointsRanking(seasonId, "total");
}

export async function getSinglesRanking(
	seasonId: string
): Promise<{ rank: number; score: number; name: string; season: string }[]> {
	return getPointsRanking(seasonId, "single");
}

export async function getDoublesRanking(
	seasonId: string
): Promise<{ rank: number; score: number; name: string; season: string }[]> {
	return getPointsRanking(seasonId, "doubles");
}

/**
 * Interface for a class change record
 */
export interface ClassChangeRecord {
	id: string;
	member_id: string;
	old_single_class: string;
	new_single_class: string;
	old_double_class: string;
	new_double_class: string;
	change_date: string;
}

/**
 * Interface for member class history
 */
export interface MemberClassHistory {
	history: ClassChangeRecord[];
	currentSingleClass: string;
	previousSingleClass: string;
	currentDoubleClass: string;
	previousDoubleClass: string;
	error: Error | null;
}

/**
 * Get a member's class change history
 * @param memberId - The ID of the member
 * @returns Object containing class change history and current/previous class information
 */
export async function getMemberClassHistory(memberId: string): Promise<MemberClassHistory> {
	try {
		const { data, error } = await supabaseClient
			.from("class_change_log")
			.select("*")
			.eq("member_id", memberId)
			.order("change_date", { ascending: false });

		if (error) {
			throw error;
		}

		// Default values if no history is found
		let currentSingleClass = "";
		let previousSingleClass = "";
		let currentDoubleClass = "";
		let previousDoubleClass = "";

		// If history exists, set current and previous classes
		if (data && data.length > 0) {
			// Most recent entry
			currentSingleClass = data[0].new_single_class;
			currentDoubleClass = data[0].new_double_class;

			// Previous classes
			previousSingleClass = data[0].old_single_class;
			previousDoubleClass = data[0].old_double_class;
		}

		return {
			history: data || [],
			currentSingleClass,
			previousSingleClass,
			currentDoubleClass,
			previousDoubleClass,
			error: null,
		};
	} catch (error) {
		console.error("Error fetching member class history:", error);
		return {
			history: [],
			currentSingleClass: "",
			previousSingleClass: "",
			currentDoubleClass: "",
			previousDoubleClass: "",
			error: error as Error,
		};
	}
}
