import React from "react";

const tabs = [
  { name: "Company", value: "company" },
  { name: "Invoice appearance", value: "invoice" },
  { name: "Default settings", value: "default" },
  { name: "Accounting", value: "accounting" },
  { name: "Data storage", value: "storage" },
  { name: "Custom extra fields", value: "custom" },
];

export default function SettingsTabs({ active, onChange }) {
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
          {tab.name}
        </button>
      ))}
    </div>
  );
}
