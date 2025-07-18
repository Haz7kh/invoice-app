import React from "react";
import CompanyInput from "../components/CompanyInput";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Register Company</h2>
        <CompanyInput
          onSuccess={() => alert("Company registered successfully!")}
        />
      </div>
    </div>
  );
}
