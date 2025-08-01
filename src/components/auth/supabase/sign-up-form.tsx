"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { RouterLink } from "@/components/core/link";
import { DynamicLogo } from "@/components/core/logo";
import { toast } from "@/components/core/toaster";

interface OAuthProvider {
	id: "google" | "kakao";
	name: string;
	logo: string;
}

const oAuthProviders = [
	{ id: "google", name: "Google", logo: "/assets/logo-google.svg" },
	{ id: "kakao", name: "Kakao", logo: "/assets/logo-kakao.png" },
] satisfies OAuthProvider[];

const schema = zod.object({
	name: zod.string().min(1, { message: "First name is required" }),
	phone: zod.string().min(1, { message: "Phone is required" }),
	password: zod.string().min(6, { message: "Password should be at least 6 characters" }),
	email: zod.string().email({ message: "Invalid email address" }),
	terms: zod.boolean().refine((value) => value, "You must accept the terms and conditions"),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { name: "", phone: "", email: "", password: "", terms: false } satisfies Values;

export function SignUpForm(): React.JSX.Element {
	const [supabaseClient] = React.useState<SupabaseClient>(createSupabaseClient());

	const navigate = useNavigate();

	const [isPending, setIsPending] = React.useState<boolean>(false);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

	const onAuth = React.useCallback(
		async (providerId: OAuthProvider["id"]): Promise<void> => {
			setIsPending(true);

			const redirectToUrl = new URL(paths.auth.callback, globalThis.location.origin);
			redirectToUrl.searchParams.set("next", paths.dashboard.overview);
			redirectToUrl.searchParams.set("provider", providerId);

			const { data, error } = await supabaseClient.auth.signInWithOAuth({
				provider: providerId,
				options: { redirectTo: redirectToUrl.href },
			});

			if (error) {
				setIsPending(false);
				toast.error(error.message);
				return;
			}

			globalThis.location.href = data.url;
		},
		[supabaseClient]
	);

	const onSubmit = React.useCallback(
		async (values: Values): Promise<void> => {
			setIsPending(true);

			const redirectToUrl = new URL(paths.auth.callback, globalThis.location.origin);
			redirectToUrl.searchParams.set("next", paths.dashboard.overview);

			const { data, error } = await supabaseClient.auth.signUp({
				phone: values.phone,
				email: values.email,
				password: values.password,
				options: { emailRedirectTo: redirectToUrl.href, channel: "sms" },
			});

			if (error) {
				setError("root", { type: "server", message: error.message });
				setIsPending(false);
				return;
			}

			if (data.session) {
				// UserProvider will handle Router refresh
				// After refresh, AuthGuard will handle the redirect
				return;
			}

			if (data.user) {
				const { error: insertError } = await supabaseClient.from("members").insert({
					id: data.user.id,
					phone: values.phone,
					email: values.email,
					name: values.name,
				});

				if (insertError) {
					throw new Error(insertError.message);
				}

				const searchParams = new URLSearchParams({ email: values.email });
				navigate(`${paths.auth.signUpConfirm}?${searchParams.toString()}`);
				return;
			}

			setIsPending(false);
		},
		[supabaseClient, navigate, setError]
	);

	return (
		<Stack spacing={4}>
			<div>
				<Box component={RouterLink} href={paths.home} sx={{ display: "inline-block", fontSize: 0 }}>
					<DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
				</Box>
			</div>
			<Stack spacing={1}>
				<Typography variant="h5">Sign up</Typography>
				<Typography color="text.secondary" variant="body2">
					Already have an account?{" "}
					<Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
						Sign in
					</Link>
				</Typography>
			</Stack>
			<Stack spacing={3}>
				<Stack spacing={2}>
					{oAuthProviders.map(
						(provider): React.JSX.Element => (
							<Button
								color="secondary"
								disabled={isPending}
								endIcon={<Box alt="" component="img" height={24} src={provider.logo} width={24} />}
								key={provider.id}
								onClick={(): void => {
									onAuth(provider.id).catch(() => {
										// noop
									});
								}}
								variant="outlined"
							>
								Continue with {provider.name}
							</Button>
						)
					)}
				</Stack>
				<Divider>or</Divider>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={2}>
						<Controller
							control={control}
							name="name"
							render={({ field }) => (
								<FormControl error={Boolean(errors.name)}>
									<InputLabel>Name</InputLabel>
									<OutlinedInput {...field} />
									{errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<FormControl error={Boolean(errors.email)}>
									<InputLabel>Email address</InputLabel>
									<OutlinedInput {...field} type="email" />
									{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="phone"
							render={({ field }) => (
								<FormControl error={Boolean(errors.phone)}>
									<InputLabel>Phone number</InputLabel>
									<OutlinedInput {...field} type="phone" />
									{errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<FormControl error={Boolean(errors.password)}>
									<InputLabel>Password</InputLabel>
									<OutlinedInput {...field} type="password" />
									{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="terms"
							render={({ field }) => (
								<div>
									<FormControlLabel
										control={<Checkbox {...field} />}
										label={
											<React.Fragment>
												I have read the <Link>terms and conditions</Link>
											</React.Fragment>
										}
									/>
									{errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
								</div>
							)}
						/>
						{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
						<Button disabled={isPending} type="submit" variant="contained">
							Create account
						</Button>
					</Stack>
				</form>
			</Stack>
		</Stack>
	);
}
