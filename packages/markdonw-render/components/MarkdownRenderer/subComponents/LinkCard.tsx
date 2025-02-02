import type { RootContentMap } from "mdast";
import { fetchSiteMetadata } from "../../../lib/fetchSiteMetadata";
import styles from "./LinkCard.module.scss";
import { getFaviconURL } from "../../../lib/getFavionURL";

export async function LinkCard({
	node,
}: {
	node: RootContentMap["link-card"];
}) {
	const { url: _url } = node;
	const url = new URL(_url);
	const result = await fetchSiteMetadata(url.toString());
	if (result == null) {
		return null;
	}

	const { ogTitle, ogDescription, requestUrl, ogImage } = result;

	return (
		<a
			href={requestUrl}
			className={styles.linkCard}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className={styles.linkCardInfo}>
				<h1 className={styles.linkCardInfo__title}>{ogTitle}</h1>
				<div className={styles.linkCardInfo__description}>{ogDescription}</div>
				<div className={styles.linkCardInfo__url}>
					<img src={getFaviconURL(url.hostname)} alt={""} />
					{url.hostname}
				</div>
			</div>
			{ogImage?.[0].url && (
				<div className={styles.linkCardImage}>
					<img src={ogImage[0].url} alt={""} />
				</div>
			)}
		</a>
	);
}
