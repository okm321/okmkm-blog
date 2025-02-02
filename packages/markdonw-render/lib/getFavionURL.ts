export const getFaviconURL = (url: string, size: 16 | 3 | 64 = 64) => {
	return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
		url,
	)}&size=${size}`;
};
