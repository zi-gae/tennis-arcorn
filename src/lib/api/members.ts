import { createClient } from "../supabase/client";

export type Member = {
	id: string;
	name: string;
	email: string;
	phone: string;
	ntrp: string;
	status: string;
	role: string;
	joined_at: string;
	created_at: string;
	single_class: string;
	double_class: string;
};

type GetMembersOptions = {
	page?: number;
	pageSize?: number;
	status?: string;
	role?: string;
	searchQuery?: string;
	orderBy?: {
		column: string;
		ascending: boolean;
	};
};

const supabaseClient = createClient();

export async function getMembers(options: GetMembersOptions = {}): Promise<{
	data: Member[] | null;
	count: number | null;
	error: Error | null;
}> {
	try {
		const {
			page = 1,
			pageSize = 10,
			status,
			role,
			searchQuery,
			orderBy = { column: "name", ascending: true },
		} = options;

		// Start building query
		let query = supabaseClient.from("members").select("*", { count: "exact" });

		// Apply filters
		if (status) {
			query = query.eq("status", status);
		}

		if (role) {
			query = query.eq("role", role);
		}

		if (searchQuery) {
			query = query.or(
				`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%`
			);
		}

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
		console.error("Error fetching members:", error);
		return { data: null, count: null, error: error as Error };
	}
}

// Get a single member by ID
export async function getMemberById(id: string): Promise<{
	data: Member | null;
	error: Error | null;
}> {
	try {
		const { data, error } = await supabaseClient.from("members").select("*").eq("id", id).single();

		return { data, error };
	} catch (error) {
		console.error("Error fetching member:", error);
		return { data: null, error: error as Error };
	}
}

/**
 * Update a member's information by ID
 * @param id - The ID of the member to update
 * @param updates - Object containing the fields to update
 * @returns Object containing the updated member data or error
 */
export async function updateMember(
	id: string,
	updates: Partial<Omit<Member, "id" | "created_at">>
): Promise<{
	data: Member | null;
	error: Error | null;
}> {
	try {
		const { data, error } = await supabaseClient.from("members").update(updates).eq("id", id).select().single();

		if (error) throw error;

		return { data, error: null };
	} catch (error) {
		console.error("Error updating member:", error);
		return { data: null, error: error as Error };
	}
}

/**
 * Add a new member to the database
 * @param memberData - Object containing the member information
 * @returns Object containing the created member data or error
 */
export async function addMember(memberData: Omit<Member, "id" | "created_at">): Promise<{
	data: Member | null;
	error: Error | null;
}> {
	try {
		const { data, error } = await supabaseClient.from("members").insert(memberData).select().single();

		if (error) throw error;

		return { data, error: null };
	} catch (error) {
		console.error("Error adding member:", error);
		return { data: null, error: error as Error };
	}
}
