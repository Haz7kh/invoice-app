import React from "react";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { t } = useTranslation();

  return (
    <>
      <div className="ml-64 h-1/2 flex justify-center items-end">
        <h1 className="text-3xl font-semibold text-gray-600">comming soon ...</h1>
      </div>
    </>
  );
}
