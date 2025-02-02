import ogs from "open-graph-scraper";

export const fetchSiteMetadata = async (url: string) => {
	const options = { url };

	return ogs(options).then((data) => {
		const { result } = data;
		if (result.success) {
			return result;
		}

		return null;
	});
};
