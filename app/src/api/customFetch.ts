export const customFetch = async <T>(
	path: RequestInfo | URL,
	options?: RequestInit,
): Promise<T> => {
	const baseURL = process.env.API_BASE_URL;
	const res = await fetch(`${baseURL}${path}`, {
		credentials: "include",
		...options,
	});

	return res.json();
};
