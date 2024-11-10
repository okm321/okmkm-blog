"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type UseMatchMediaArgs = {
	query: string;
	initialState?: boolean;
};

export const useMatchMedia = ({ query, initialState }: UseMatchMediaArgs) => {
	const matchMediaList = useMemo(
		() =>
			typeof window === "undefined" ? undefined : window.matchMedia(query),
		[query],
	);

	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			matchMediaList?.addEventListener("change", onStoreChange);
			return () => matchMediaList?.removeEventListener("change", onStoreChange);
		},
		[matchMediaList],
	);
	return useSyncExternalStore(
		subscribe,
		() => matchMediaList?.matches ?? initialState,
		() => initialState,
	);
};
