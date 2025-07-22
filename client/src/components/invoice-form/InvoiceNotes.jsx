import React from "react";

export default function InvoiceNotes({ notes, handleChange }) {
  return (
    <div className="mt-6">
      <label className="block font-medium mb-1">Notes:</label>
      <textarea
        name="notes"
        rows="3"
        value={notes}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
