import * as React from "react";

import type { MemberMatchRecord } from "@/lib/api/matches";

interface State {
	selectedAll: boolean;
	selectedMatches: Record<number, boolean>;
	handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleSelectOne: (event: React.ChangeEvent<HTMLInputElement>, matchId: number) => void;
	clearSelection: () => void;
}

interface MatchesSelectionProviderProps {
	children?: React.ReactNode;
	matches?: MemberMatchRecord[];
}

const MatchesSelectionContext = React.createContext<State | undefined>(undefined);

export function MatchesSelectionProvider(props: MatchesSelectionProviderProps) {
	const { children, matches = [] } = props;
	const [selectedMatches, setSelectedMatches] = React.useState<Record<number, boolean>>({});

	// Reset selected on matches change
	React.useEffect(() => {
		setSelectedMatches({});
	}, [matches]);

	const handleSelectAll = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>): void => {
			setSelectedMatches((prevState) => {
				const newSelectedMatches: Record<number, boolean> = {};

				if (event.target.checked) {
					matches.forEach((match) => {
						newSelectedMatches[match.match_id] = true;
					});
				}

				return newSelectedMatches;
			});
		},
		[matches]
	);

	const handleSelectOne = React.useCallback((event: React.ChangeEvent<HTMLInputElement>, matchId: number): void => {
		setSelectedMatches((prevState) => {
			const newSelectedMatches = { ...prevState };

			if (event.target.checked) {
				newSelectedMatches[matchId] = true;
			} else {
				delete newSelectedMatches[matchId];
			}

			return newSelectedMatches;
		});
	}, []);

	const clearSelection = React.useCallback((): void => {
		setSelectedMatches({});
	}, []);

	const selectedAll = matches.length > 0 && Object.keys(selectedMatches).length === matches.length;

	const contextValue = React.useMemo(
		() => ({
			selectedAll,
			selectedMatches,
			handleSelectAll,
			handleSelectOne,
			clearSelection,
		}),
		[handleSelectAll, handleSelectOne, clearSelection, selectedAll, selectedMatches]
	);

	return <MatchesSelectionContext.Provider value={contextValue}>{children}</MatchesSelectionContext.Provider>;
}

export function useMatchesSelection(): State {
	const context = React.useContext(MatchesSelectionContext);

	if (context === undefined) {
		throw new Error("useMatchesSelection must be used within a MatchesSelectionProvider");
	}

	return context;
}
