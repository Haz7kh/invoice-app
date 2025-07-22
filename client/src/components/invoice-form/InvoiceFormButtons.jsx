import React from "react";

export default function InvoiceFormButtons({
  isSubmitting,
  handleSubmit,
  onCancel,
}) {
  return (
    <div className="mt-6 flex gap-4">
      <button
        className={`${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        } bg-green-600 text-white px-6 py-2 rounded`}
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? "Saving..." : "Create Invoice"}
      </button>
      <button className="px-6 py-2 border rounded" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
