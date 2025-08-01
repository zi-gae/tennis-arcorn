import { createClient } from "../supabase/client";

export type Match = {
	id: number;
	season_id: number;
	match_date: string;
	winner_team: number;
	match_type: string;
	team1_score: number;
	team2_score: number;
};

type GetMatchesOptions = {
	page?: number;
	pageSize?: number;
	orderBy?: {
		column: string;
		ascending: boolean;
	};
};

const supabaseClient = createClient();

// Get matches with pagination and sorting
export async function getMatches(options: GetMatchesOptions = {}): Promise<{
	data: Match[] | null;
	count: number | null;
	error: Error | null;
}> {
	try {
		const { page = 1, pageSize = 10, orderBy = { column: "match_date", ascending: false } } = options;

		// Start building query
		let query = supabaseClient
			.from("matches")
			.select("id, season_id, match_date, winner_team, match_type, team1_score, team2_score", {
				count: "exact",
			});

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
		console.error("Error fetching matches:", error);
		return { data: null, count: null, error: error as Error };
	}
}

// Insert a new match
export async function insertMatch(match: Omit<Match, "id">): Promise<{
	data: Match | null;
	error: string | null;
}> {
	try {
		const { data, error } = await supabaseClient.from("matches").insert([match]).select().single();

		if (error) {
			console.error("Error inserting match:", error);
			return { data: null, error: error.message };
		}

		return { data, error: null };
	} catch (error) {
		console.error("Unexpected error inserting match:", error);
		return { data: null, error: "Unexpected error occurred while inserting match." };
	}
}

type RecordMatchOptions = {
	matchType: "single" | "doubles";
	ourTeamMembers: string[]; // Array of member IDs (UUIDs)
	opponentTeamMembers: string[]; // Array of member IDs (UUIDs)
	ourTeamScore: number;
	opponentTeamScore: number;
	gameNumber: number;
	seasonId: number;
	matchDate: string; // ISO string
};

export async function recordMatch(options: RecordMatchOptions): Promise<{
	data: Match | null;
	error: string | null;
}> {
	const {
		matchType,
		ourTeamMembers,
		opponentTeamMembers,
		ourTeamScore,
		opponentTeamScore,
		gameNumber,
		seasonId,
		matchDate,
	} = options;

	try {
		// 1. Insert match record
		const { data: matchData, error: matchError } = await supabaseClient
			.from("matches")
			.insert([
				{
					season_id: seasonId,
					match_date: matchDate,
					winner_team: ourTeamScore > opponentTeamScore ? 1 : 2,
					match_type: matchType,
					team1_score: ourTeamScore,
					team2_score: opponentTeamScore,
					game_number: gameNumber,
				},
			])
			.select()
			.single();

		if (matchError || !matchData) {
			return { data: null, error: `Error inserting match: ${matchError?.message}` };
		}

		// 2. Prepare participants
		const ourTeamParticipants = ourTeamMembers.map((memberId) => ({
			match_id: matchData.id,
			member_id: memberId,
			team_no: 1,
		}));

		const opponentTeamParticipants = opponentTeamMembers.map((memberId) => ({
			match_id: matchData.id,
			member_id: memberId,
			team_no: 2,
		}));

		// 3. Insert participants
		const { error: participantsError } = await supabaseClient
			.from("match_participants")
			.insert([...ourTeamParticipants, ...opponentTeamParticipants]);

		if (participantsError) {
			return {
				data: null,
				error: `Error inserting participants: ${participantsError.message}`,
			};
		}

		return { data: matchData, error: null };
	} catch (error) {
		console.error("Error recording match:", error);
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error occurred.",
		};
	}
}
export type MatchJoinData = {
	match_id: number;
	team_no: number;
	member_id: string; // Added member_id
	members: {
		// Added members object
		name: string;
	};
	matches: {
		season_id: number;
		match_date: string;
		winner_team: number;
		match_type: string;
		team1_score: number;
		team2_score: number;
	};
};

export type MemberMatchRecord = {
	match_id: number;
	season_id: number;
	match_date: string;
	winner_team: number;
	match_type: string;
	team1_score: number;
	team2_score: number;
	team_no: number;
	member_id: string; // Added member_id
	member_name: string; // Added member_name
};

export type GetMatchRecordsOptions = {
	memberId?: string;
	memberIds?: string[]; // 🔥 추가: 여러 명 지원
	memberName?: string; // Added member name search
	seasonId?: number;
	matchType?: "single" | "doubles";
	teamNo?: number;
	page?: number;
	pageSize?: number;
	asc?: boolean; // Added parameter to control sort direction
};

export async function getMatchRecords(options: GetMatchRecordsOptions = {}): Promise<{
	data: MemberMatchRecord[] | null;
	count: number | null;
	error: string | null;
}> {
	const {
		memberId,
		memberIds,
		memberName,
		seasonId,
		matchType,
		teamNo,
		page = 1,
		pageSize = 10,
		asc = false,
	} = options;

	if ((memberId && memberIds) || (memberId && memberName) || (memberIds && memberName)) {
		return {
			data: null,
			count: null,
			error: "You can only specify one of memberId, memberIds, or memberName at a time.",
		};
	}

	try {
		let query = supabaseClient.from("v_match_records").select("*", { count: "exact" });

		// 조건 필터
		if (memberId !== undefined) {
			query = query.eq("member_id", memberId);
		}
		if (memberIds !== undefined) {
			query = query.in("member_id", memberIds);
		}
		if (memberName !== undefined) {
			query = query.ilike("member_name", `%${memberName}%`);
		}
		if (seasonId !== undefined) {
			query = query.eq("season_id", seasonId);
		}
		if (matchType !== undefined) {
			query = query.eq("match_type", matchType);
		}
		if (teamNo !== undefined) {
			query = query.eq("team_no", teamNo);
		}

		// Order by match_date with configurable direction
		query = query.order("match_id", { ascending: asc });

		// 페이지네이션 적용
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;
		query = query.range(from, to);

		const { data, count, error } = await query;

		if (error) {
			console.error("Error fetching match records:", error);
			return { data: null, count: null, error: error.message };
		}

		return { data, count, error: null };
	} catch (error) {
		console.error("Unexpected error fetching match records:", error);
		return {
			data: null,
			count: null,
			error: error instanceof Error ? error.message : "Unexpected error occurred.",
		};
	}
}

export function getMatcheById(id: number): Promise<{
	data: Match | null;
	error: Error | null;
}> {
	return new Promise((resolve) => {
		supabaseClient
			.from("matches")
			.select("*")
			.eq("id", id)
			.single()
			.then(({ data, error }) => {
				if (error) {
					console.error("Error fetching match:", error);
					resolve({ data: null, error });
				} else {
					resolve({ data, error: null });
				}
			});
	});
}

export async function deleteMatch(id: number): Promise<{
	success: boolean;
	error: string | null;
}> {
	try {
		const { error } = await supabaseClient.from("matches").delete().eq("id", id);

		if (error) {
			console.error("Error deleting match:", error);
			return { success: false, error: error.message };
		}

		return { success: true, error: null };
	} catch (error) {
		console.error("Unexpected error deleting match:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unexpected error occurred while deleting match.",
		};
	}
}
