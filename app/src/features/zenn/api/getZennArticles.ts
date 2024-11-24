import RssParser from "rss-parser";

type ZennArticle = {
	/** 作成者 */
	creator: string;
	/** タイトル */
	title: string;
	/** リンク */
	link: string;
	/** 公開日 */
	pubDate: string;
	/** サムネイル */
	thumbnail: string;
	/** 本文 */
	content: string;
	/** 本文（スニペット） */
	contentSnippet: string;
	/** guid */
	guid: string;
	isoDate: string;
};

export const getZennArticles = async (): Promise<ZennArticle[]> => {
	const parser = new RssParser();
	const feedUrl = "https://zenn.dev/okmkm321/feed";

	const xmlText = await fetch(feedUrl).then((res) => res.text());
	const feed = await parser.parseString(xmlText);

	return feed.items.map((item) => ({
		creator: item.creator || "",
		title: item.title || "",
		link: item.link || "",
		pubDate: item.pubDate || "",
		thumbnail: item.enclosure?.url ?? "",
		content: item.content || "",
		contentSnippet: item.contentSnippet || "",
		guid: item.guid || "",
		isoDate: item.isoDate || "",
	}));
};
