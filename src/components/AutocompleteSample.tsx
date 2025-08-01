"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { toast } from "@/components/core/toaster";

const schema = zod.object({
	name: zod.string().min(1, "Name is required").max(255),
	handle: zod.string().max(255).optional(),
	category: zod.string().max(255).optional(),
	type: zod.string().max(255).optional(),
	description: zod.string().max(5000).optional(),
	tags: zod.string().max(255).optional(),
});

const categories = [
	{ label: "Healthcare", value: "Healthcare" },
	{ label: "Makeup", value: "Makeup" },
	{ label: "Skincare", value: "Skincare" },
];
type Values = zod.infer<typeof schema>;

const defaultValues = {
	name: "",
	handle: "",
	category: "",
	type: "physical",
	description: "",
	tags: "",
} satisfies Values;

export function ProductCreateForm(): React.JSX.Element {
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (_: Values): Promise<void> => {
			try {
				// Make API request
				toast.success("Product created");
				navigate(paths.dashboard.products.list);
			} catch (error) {
				logger.error(error);
				toast.error("Something went wrong!");
			}
		},
		[navigate]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="category"
				control={control}
				render={({ field }) => (
					<Autocomplete
						options={categories}
						getOptionLabel={(option) => option.label}
						onChange={(_, value) => field.onChange(value?.value || "")}
						value={categories.find((opt) => opt.value === field.value) || null}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Category"
								error={Boolean(errors.category)}
								helperText={errors.category?.message}
							/>
						)}
					/>
				)}
			/>
		</form>
	);
}
