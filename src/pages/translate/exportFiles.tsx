import React, { useState } from "react";
import Modal from "../../components/modal";
import { intlLanguages } from "./config";
import { downloadFileFromBlob, exportLocalFiles, makeLocalesInZip } from "./services";
import Spinner from "../../components/spinner";
import { useNotification } from "../../notify";
import { compress } from "./utils";
import { FileType } from "./types";
import { translate2Files } from "../../services/translate2Files";
import { useGlobalStore } from "../../store";
import { toJS } from "mobx";

interface ExportFilesProps {
    originalContent: string;
    fileType: FileType;
}

const locales = [
    // {"locale": "en", "lang": "English"},
    {"locale": "es", "lang": "Español"},
    {"locale": "pt-br", "lang": "Português do Brasil"},
    {"locale": "de", "lang": "Deutsch"},
    {"locale": "fr", "lang": "Français"},
    {"locale": "he", "lang": "עִבְרִית"},
    {"locale": "ja", "lang": "日本語"},
    {"locale": "it", "lang": "Italiano"},
    {"locale": "nl", "lang": "Nederlands"},
    {"locale": "ru", "lang": "Русский"},
    {"locale": "tr", "lang": "Türkçe"},
    {"locale": "id", "lang": "Bahasa Indonesia"},
    {"locale": "zh-cn", "lang": "简体中文"},
    {"locale": "zh-tw", "lang": "繁體中文"},
    {"locale": "ko", "lang": "한국어"},
    {"locale": "ar", "lang": "العربية"},
    {"locale": "sv", "lang": "Svenska"}
] as const;


const ExportFiles: React.FC<ExportFilesProps> = (props) => {
    const { originalContent } = props;
    const [show, setShow] = useState<boolean>(false);
    const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { notify } = useNotification();
    const { commonStore } = useGlobalStore();

    const handleLangChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedLangs([...selectedLangs, value]);
        } else {
            setSelectedLangs(selectedLangs.filter((lang) => lang !== value));
        }
    };

    async function downloadFiles() {
        setLoading(true);
        try {
            const compressedContent = compress(originalContent, props.fileType);
            // const res = await exportLocalFiles(compressedContent, selectedLangs, props.fileType);
            const resultList = await translate2Files({
                content: compressedContent,
                langList: locales.map(l => l.lang),
                config: toJS(commonStore.config)
            })
            const file = await makeLocalesInZip(resultList.map((item) => {
                const found = locales.find(l => l.lang === item.lang);
                if (!found) {
                    console.error('locale not found', item);
                    return {
                      ...item,
                      locale: item.lang,
                    };
                }
                return {
                  ...item,
                  locale: found.locale as string,
                };
            }), 'ts');
            downloadFileFromBlob(file, "locales.zip");
        } catch (error) {
            notify(
                {
                    title: "export files error",
                    message: `${error}`,
                    type: "error",
                },
                3000
            );
        } finally {
            setLoading(false);
            setShow(false);
        }
    }

    return (
        <span>
            {locales.map(l => l.locale).join(',')}
            <button
                type="button"
                className="ml-2 px-6 rounded bg-indigo-500 shadow-indigo-500/50 py-1.5 px-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={() => {
                    setShow(true);
                }}
            >
                Translate to files
            </button>
            <Modal
                open={show}
                onClose={() => {
                    setShow(false);
                }}
                onConfirm={downloadFiles}
            >
                <fieldset>
                    <legend className="text-base font-semibold leading-6 text-gray-50">Languages</legend>
                    <div className="mt-4 divide-y divide-gray-600 border-t border-b border-gray-600">
                        {locales.map(l => <div key={l.locale}>{l.locale} {l.lang}</div>)}
                        {/*{intlLanguages.map((lang, personIdx) => (*/}
                        {/*    <div key={personIdx} className="relative flex items-start py-2">*/}
                        {/*        <div className="min-w-0 flex-1 text-sm leading-6">*/}
                        {/*            <label htmlFor={`person-${lang.value}`} className="select-none font-medium text-gray-50">*/}
                        {/*                {lang.label} | {lang.value}*/}
                        {/*            </label>*/}
                        {/*        </div>*/}
                        {/*        <div className="ml-3 flex h-6 items-center">*/}
                        {/*            <input*/}
                        {/*                checked={selectedLangs.includes(lang.value)}*/}
                        {/*                id={`person-${lang.value}`}*/}
                        {/*                name={`person-${lang.value}`}*/}
                        {/*                value={lang.value}*/}
                        {/*                type="checkbox"*/}
                        {/*                className="h-4 w-4 rounded bg-gray-900 border-gray-500 text-indigo-600 focus:ring-indigo-600"*/}
                        {/*                onChange={handleLangChange}*/}
                        {/*            />*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                    </div>
                </fieldset>
                {loading && (
                    <div className="flex justify-center py-2">
                        <Spinner />
                        <h2 className="text-base font-white">Generate locale files</h2>
                    </div>
                )}
            </Modal>
        </span>
    );
};

export default ExportFiles;
