"use client";

import * as React from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { getMemberById, Member } from "@/lib/api/members";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

type AuthState = {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: User | null;
	member: Member | null;
	signOut: () => Promise<void>; // Added signOut function
};

export const AuthContext = React.createContext<AuthState>({
	isAuthenticated: false,
	isLoading: true,
	user: null,
	member: null,
	signOut: async () => {}, // Default implementation
});

export interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): React.JSX.Element => {
	const [supabaseClient] = React.useState<SupabaseClient>(createSupabaseClient());

	const [state, setState] = React.useState<AuthState>({
		isAuthenticated: false,
		isLoading: true,
		user: null,
		member: null,
		signOut: async () => {
			try {
				console.log("@@@LOGOUT");
				await supabaseClient.auth.signOut();
				localStorage.removeItem("sb-hsuosrobaujskzclmiyj-auth-token");
				setState((prevState) => ({
					...prevState,
					isAuthenticated: false,
					user: null,
					member: null,
				}));
			} catch (error) {
				console.error("Error signing out:", error);
			}
		},
	});

	// Check if user is existing in supabase
	React.useEffect(() => {
		const checkUser = async () => {
			const {
				data: { session },
			} = await supabaseClient.auth.getSession();

			if (session?.user.id) {
				const { data: memberData, error: memberError } = await getMemberById(session.user.id);
				if (!memberData) {
					const { data } = await supabaseClient.auth.getSession();
					supabaseClient.functions.invoke("hyper-responder", {
						body: {
							id: data.session?.user.id,
							email: data.session?.user.email,
							name: data.session?.user.user_metadata.name,
							role: "member",
						},
					});
				}
			}
		};

		checkUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		const {
			data: { subscription },
		} = supabaseClient.auth.onAuthStateChange((_, session) => {
			setState((prevState) => ({
				...prevState,
				isAuthenticated: Boolean(session?.user),
				isLoading: false,
				user: session?.user ?? null,
				member: null, // Reset member before fetching
			}));

			// If user exists, fetch member details
			if (session?.user) {
				(async () => {
					const { data: memberData, error } = await getMemberById(session.user.id);
					if (error) {
						console.error("Error fetching member:", error);
						return;
					}
					setState((prevState) => ({
						...prevState,
						member: memberData,
					}));
				})();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabaseClient]);

	return <AuthContext.Provider value={{ ...state }}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthState {
	const context = React.useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
