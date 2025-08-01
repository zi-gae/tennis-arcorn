import * as React from "react";
// dayjs 설정
import dayjs from "dayjs";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { routes } from "@/routes";
import { Root } from "@/root";
import { ScrollRestoration } from "@/components/core/scroll-restoration";

import "dayjs/locale/ko"; // 한글 로케일 import

dayjs.locale("ko"); // 전역 로케일 설정

const root = createRoot(document.querySelector("#root")!);

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Root>
				<ScrollRestoration />
				<Outlet />
			</Root>
		),
		children: [...routes],
	},
]);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
