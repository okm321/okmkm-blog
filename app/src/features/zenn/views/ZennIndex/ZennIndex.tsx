import type { FC } from "react";
import { SectionTitle } from "@/components/shared/SectionTitle/SectionTitle";
import { ZennList } from "../../components/ZennList";

export const ZennIndex: FC = async () => {
	return (
		<section>
			<SectionTitle>Zenn</SectionTitle>
			<ZennList />
		</section>
	);
};
