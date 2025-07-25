import React from "react";
import { useTranslation } from "react-i18next";

const tabs = [
  { nameKey: "settingsTabs.company", value: "company" },
  { nameKey: "settingsTabs.invoice", value: "invoice" },
  { nameKey: "settingsTabs.default", value: "default" },
  { nameKey: "settingsTabs.accounting", value: "accounting" },
  { nameKey: "settingsTabs.storage", value: "storage" },
  { nameKey: "settingsTabs.custom", value: "custom" },
];

export default function SettingsTabs({ active, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex space-x-4 border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-all ${
            active === tab.value
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-500 hover:border-green-300"
          }`}
          onClick={() => onChange(tab.value)}
        >
          {t(tab.nameKey)}
        </button>
      ))}
    </div>
  );
}
