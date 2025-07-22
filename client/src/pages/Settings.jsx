import React, { useState } from "react";
import SettingsTabs from "../components/SettingsTabs";
import InvoiceAppearanceSettings from "../components/settings_components/InvoiceAppearanceSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("invoice"); // Default to a valid tab

  // Local user setting (can later fetch/save via API)
  const [userSettings, setUserSettings] = useState({
    invoiceTemplate: "original",
  });

  const handleSaveSettings = () => {
    console.log("Saving template:", userSettings.invoiceTemplate);
    alert("Template saved (simulated)");
  };

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <SettingsTabs active={activeTab} onChange={setActiveTab} />

      <div className="bg-white p-6 rounded-xl shadow">
        {activeTab === "invoice" && (
          <div>
            <InvoiceAppearanceSettings
              selected={userSettings.invoiceTemplate}
              onChange={(val) =>
                setUserSettings({ ...userSettings, invoiceTemplate: val })
              }
            />
            <button
              onClick={handleSaveSettings}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
            >
              Save Template
            </button>
          </div>
        )}

        {activeTab === "default" && <p>Default settings content here</p>}
        {activeTab === "accounting" && <p>Accounting settings here</p>}
        {activeTab === "storage" && <p>Data storage section here</p>}
        {activeTab === "custom" && <p>Custom extra fields here</p>}
      </div>
    </div>
  );
}
