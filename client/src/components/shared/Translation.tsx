import { useTranslation } from "react-i18next";
import { Translation } from "../../types/Translation";

type Props = {
    translations: Translation[]
}
export default function ({ translations }: Props) {
    const { i18n } = useTranslation();
    return <span>{
        translations.find(x => x.language === i18n.language)?.content || null
    }</span>;
}