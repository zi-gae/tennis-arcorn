import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

import { getMembers } from "../../../lib/api/members"; // Import getMembers function

interface Member {
	id: string;
	name: string;
}

interface MemberSelectProps {
	label: string;
	selectedMembers: string[];
	onChange: (members: string[]) => void;
}

export const MemberSelect: React.FC<MemberSelectProps> = ({ label, selectedMembers, onChange }) => {
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchMembers = async () => {
			setLoading(true);
			try {
				const { data, error } = await getMembers({ pageSize: 100 });
				if (error) {
					console.error("Failed to fetch members:", error);
				} else {
					setMembers(data || []);
				}
			} catch (error) {
				console.error("Unexpected error fetching members:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMembers();
	}, []);

	return (
		<Autocomplete
			multiple
			options={members}
			getOptionLabel={(option) => option.name}
			loading={loading}
			value={members.filter((member) => selectedMembers.includes(member.id))}
			onChange={(_, value) => onChange(value.map((member) => member.id))}
			renderInput={(params) => (
				<TextField
					{...params}
					label={label}
					slotProps={{
						input: {
							...params.InputProps,
							endAdornment: (
								<>
									{loading ? <CircularProgress size={20} /> : null}
									{params.InputProps.endAdornment}
								</>
							),
						},
					}}
				/>
			)}
		/>
	);
};
