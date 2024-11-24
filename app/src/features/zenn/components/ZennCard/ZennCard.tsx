import { Heading } from "@/components/shared/Heading";
import Image from "next/image";
import type { FC } from "react";
import classes from "./ZennCard.module.scss";
import { formatDate } from "@packages/utils";

type Props = {
	/** 記事タイトル */
	title: string;
	/** 記事の公開日 */
	publishedAt: string;
	/** 記事のリンク */
	link: string;
	/** サムネイル */
	thumbnail: string;
};

export const ZennCard: FC<Props> = ({
	title,
	publishedAt,
	link,
	thumbnail,
}) => {
	const publishedDate = formatDate(publishedAt, "yyyy/MM/dd");
	return (
		<article className={classes.zennCard}>
			<Heading level={2} className="var(--font_rubik_doodle_shadow)">
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					className={classes.link}
				>
					<Image
						width={1200}
						height={630}
						src={thumbnail}
						alt=""
						style={{
							maxWidth: "100%",
							height: "auto",
						}}
					/>
				</a>
				<span className="visually-hidden">{title}</span>
			</Heading>
			<div className={classes.metadata}>
				<time dateTime={publishedDate}>{publishedDate}</time>
			</div>
		</article>
	);
};
