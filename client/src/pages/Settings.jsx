import React, { useState } from "react";
import SettingsTabs from "../components/SettingsTabs";
import InvoiceAppearanceSettings from "../components/settings_components/InvoiceAppearanceSettings";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("invoice");

  const [userSettings, setUserSettings] = useState({
    invoiceTemplate: "original",
  });

  const handleSaveSettings = () => {
    console.log("Saving template:", userSettings.invoiceTemplate);
    alert(t("settings.save_template") + " (simulated)");
  };

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold mb-4">{t("settings.title")}</h1>

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
              {t("settings.save_template")}
            </button>
          </div>
        )}

        {activeTab === "default" && <p>{t("settings.tabs.default")}</p>}
        {activeTab === "accounting" && <p>{t("settings.tabs.accounting")}</p>}
        {activeTab === "storage" && <p>{t("settings.tabs.storage")}</p>}
        {activeTab === "custom" && <p>{t("settings.tabs.custom")}</p>}
      </div>
    </div>
  );
}
