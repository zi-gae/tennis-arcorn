"use client";

import type * as React from "react";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";
import { TennisBall } from "@phosphor-icons/react/dist/ssr/TennisBall";

import { NoSsr } from "@/components/core/no-ssr";

const HEIGHT = 60;
const WIDTH = 60;

type Color = "dark" | "light";

export interface LogoProps {
	color?: Color;
	emblem?: boolean;
	height?: number;
	width?: number;
}

export function Logo({ color = "dark", emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
	return <TennisBall size={40} color="var(--mui-palette-primary-main)" weight="fill" />;
}

export interface DynamicLogoProps {
	colorDark?: Color;
	colorLight?: Color;
	emblem?: boolean;
	height?: number;
	width?: number;
}

export function DynamicLogo({
	colorDark = "light",
	colorLight = "dark",
	height = HEIGHT,
	width = WIDTH,
	...props
}: DynamicLogoProps): React.JSX.Element {
	const { colorScheme } = useColorScheme();
	const color = colorScheme === "dark" ? colorDark : colorLight;

	return (
		<NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
			<Logo color={color} height={height} width={width} {...props} />
		</NoSsr>
	);
}
