import { format } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * 日付を指定したフォーマットに変換する
 * @param dateStr - 日付文字列
 * @param formatTemplate - フォーマットテンプレート
 */
export const formatDate = (
	dateStr: Date | string | null,
	formatTemplate: string,
) => {
	if (!dateStr) {
		return "";
	}

	const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
	return format(date, formatTemplate, { locale: ja });
};
