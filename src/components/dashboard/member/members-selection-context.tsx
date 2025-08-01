"use client";

import * as React from "react";

import { Member } from "@/lib/api/members";
import { useSelection } from "@/hooks/use-selection";
import type { Selection } from "@/hooks/use-selection";

function noop(): void {
	// No operation
}

export interface MembersSelectionContextValue extends Selection {}

export const MembersSelectionContext = React.createContext<MembersSelectionContextValue>({
	deselectAll: noop,
	deselectOne: noop,
	selectAll: noop,
	selectOne: noop,
	selected: new Set(),
	selectedAny: false,
	selectedAll: false,
});

interface MembersSelectionProviderProps {
	children: React.ReactNode;
	members: Member[];
}

export function MembersSelectionProvider({ children, members = [] }: MembersSelectionProviderProps): React.JSX.Element {
	const customerIds = React.useMemo(() => members.map((customer) => customer.id), [members]);
	const selection = useSelection(customerIds);

	return <MembersSelectionContext.Provider value={{ ...selection }}>{children}</MembersSelectionContext.Provider>;
}

export function useMembersSelection(): MembersSelectionContextValue {
	return React.useContext(MembersSelectionContext);
}
