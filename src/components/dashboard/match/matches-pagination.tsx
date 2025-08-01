import * as React from "react";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";

interface MatchesPaginationProps {
	count: number;
	onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
	onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	page: number;
	rowsPerPage: number;
}

export function MatchesPagination({
	count,
	onPageChange,
	onRowsPerPageChange,
	page,
	rowsPerPage,
}: MatchesPaginationProps): React.JSX.Element {
	return (
		<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
			<TablePagination
				component="div"
				count={count}
				onPageChange={onPageChange}
				onRowsPerPageChange={onRowsPerPageChange}
				page={page}
				rowsPerPage={rowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</Box>
	);
}
