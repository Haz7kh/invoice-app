import React from "react";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { t } = useTranslation();

  return <h1 className="text-2xl font-bold p-6">{t("orders.title")}</h1>;
}
