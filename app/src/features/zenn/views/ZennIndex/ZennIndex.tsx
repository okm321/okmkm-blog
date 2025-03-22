import { SectionTitle } from "@/components/shared/SectionTitle/SectionTitle";
import type { FC } from "react";
import { ZennList } from "../../components/ZennList";
import styles from "./ZennIndex.module.scss";

export const ZennIndex: FC = async () => {
	return (
		<section className={styles.zennIndex}>
			<SectionTitle>Zenn</SectionTitle>
			<ZennList />
		</section>
	);
};
