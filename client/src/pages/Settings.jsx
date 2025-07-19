import React, { useState } from "react";
import SettingsTabs from "../components/SettingsTabs";
import CompanyInput from "../components/CompanyInput";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Tab Navigation */}
      <SettingsTabs active={activeTab} onChange={setActiveTab} />

      {/* Content Area */}
      <div className="bg-white p-6 rounded-xl shadow">
        {activeTab === "company" && (
          <CompanyInput onSuccess={() => alert("Company saved")} />
        )}

        {activeTab === "invoice" && <p>Invoice appearance settings here</p>}
        {activeTab === "default" && <p>Default settings content here</p>}
        {activeTab === "accounting" && <p>Accounting settings here</p>}
        {activeTab === "storage" && <p>Data storage section here</p>}
        {activeTab === "custom" && <p>Custom extra fields here</p>}
      </div>
    </div>
  );
}
