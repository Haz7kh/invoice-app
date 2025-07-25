import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: "en", flag: "🇬🇧" },
    { code: "sv", flag: "🇸🇪" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const currentLang = languages.find((l) => l.code === i18n.language);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600 transition-colors duration-150"
      >
        🌐 {t(`languageSwitcher.${currentLang.code}`)}
        <svg
          className={`h-4 w-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute mt-2 left-0 bg-white text-gray-900 border border-gray-300 shadow-lg rounded-md w-44 z-50">
          {languages.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                i18n.language === lng.code
                  ? "bg-gray-200 font-semibold"
                  : "font-normal"
              }`}
            >
              <span className="text-xl">{lng.flag}</span>
              <span>{t(`languageSwitcher.${lng.code}`)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
