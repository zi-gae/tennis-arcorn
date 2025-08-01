"use client";

import type * as React from "react";
import TablePagination from "@mui/material/TablePagination";

interface MembersPaginationProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
	onRowsPerPageChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

export function MembersPagination({
	count,
	page,
	rowsPerPage,
	onPageChange,
	onRowsPerPageChange,
}: MembersPaginationProps): React.JSX.Element {
	// You should implement the pagination using a similar logic as the filters.
	// Note that when page change, you should keep the filter search params.

	return (
		<TablePagination
			component="div"
			count={count}
			onPageChange={onPageChange}
			onRowsPerPageChange={onRowsPerPageChange}
			page={page}
			rowsPerPage={rowsPerPage}
			rowsPerPageOptions={[5, 10, 25]}
		/>
	);
}
