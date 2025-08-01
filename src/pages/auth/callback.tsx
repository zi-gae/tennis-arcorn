"use client";

import * as React from "react";
import Alert from "@mui/material/Alert";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { toast } from "@/components/core/toaster";

export function Page(): React.JSX.Element | null {
	const [supabaseClient] = React.useState<SupabaseClient>(createSupabaseClient());
	const navigate = useNavigate();
	const executedRef = React.useRef<boolean>(false);
	const [displayError, setDisplayError] = React.useState<string | null>(null);

	const handle = React.useCallback(async (): Promise<void> => {
		// Prevent rerun on DEV mode
		if (executedRef.current) {
			return;
		}

		executedRef.current = true;

		const hash = globalThis.location.hash || "#";
		const hashParams = new URLSearchParams(hash.split("#")[1]);
		const searchParams = new URLSearchParams(globalThis.location.search);
		const provider = searchParams.get("provider"); // Extract the provider (e.g., "kaka

		if (provider) {
			logger.debug(`OAuth callback from provider: ${provider}`);
		}

		if (hashParams.get("error")) {
			logger.debug(hashParams.get("error_description"));
			setDisplayError("Something went wrong");
			return;
		}

		const accessToken = hashParams.get("access_token");
		const refreshToken = hashParams.get("refresh_token");

		if (!accessToken || !refreshToken) {
			setDisplayError("Access token or refresh token is missing");
			return;
		}

		if (provider === "kakao") {
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

		const { error } = await supabaseClient.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

		if (error) {
			logger.debug(error.message);
			toast.error("Something went wrong");
			navigate(paths.auth.signIn);
			return;
		}

		const next = searchParams.get("next") || paths.dashboard.overview;

		navigate(next);
	}, [supabaseClient, navigate]);

	React.useEffect((): void => {
		handle().catch(logger.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
	}, []);

	if (displayError) {
		return <Alert color="error">{displayError}</Alert>;
	}

	return null;
}
