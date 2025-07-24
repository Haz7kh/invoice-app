import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      {["en", "sv"].map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`px-3 py-1 rounded text-sm font-medium border transition
            ${
              currentLang === lng
                ? "bg-white text-gray-900"
                : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            }`}
        >
          {lng === "en" ? "English" : "Svenska"}
        </button>
      ))}
    </div>
  );
}
