import { IUserSetting } from "../interface";
import { translateService } from "./translate";

interface IReqBody {
    content: string;
    langList: string[];
    extraPrompt?: string;
    config: IUserSetting;
}

export async function translate2Files (props: IReqBody) {
    const resultList: { lang: string; content: string }[] = [];
    for (let i = 0; i < props.langList.length; i++) {
        const lang = props.langList[i];
        try {
            const res = await translateService({
                ...props,
                targetLang: lang
            })
            resultList.push({
                lang: lang,
                content: JSON.stringify(res)
            })

            await new Promise((resolve) => {
                // Open AI RPM=3
                setTimeout(() => resolve(null), 25000);
            });
        } catch (error) {
            console.error(error);
        }
    }
    return resultList
}
