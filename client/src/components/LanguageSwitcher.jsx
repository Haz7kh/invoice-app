import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: "en", label: t("languageSwitcher.english") },
    { code: "sv", label: t("languageSwitcher.swedish") },
  ];

  return (
    <div className="flex items-center gap-2 mt-3">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`px-3 py-1 rounded text-sm font-medium border transition
            ${
              currentLang === code
                ? "bg-white text-gray-900 border-gray-400"
                : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
