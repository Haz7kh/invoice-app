import React from "react";
import Header from "../components/Header";
import { FaCheck } from "react-icons/fa";
import { useTranslation, Trans } from "react-i18next";

export default function Overview() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <div className="bg-white py-16 px-6 border-5 shadow-2xl border-white ml-64">
        <div className="max-w-6xl mx-auto flex flex-col items-start gap-10">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <Trans i18nKey="overview.welcome_title">
                Welcome to <span className="text-blue-600">EasyInvoice</span>
              </Trans>
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              {t("overview.welcome_description")}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="flex items-center gap-3 text-xl text-gray-800 font-medium">
                  <FaCheck
                    className="bg-green-500 text-white p-1 rounded-full"
                    size={20}
                  />
                  {t("overview.feature_1_title")}
                </h3>
                <p className="pl-9 text-gray-500">
                  {t("overview.feature_1_desc")}
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-3 text-xl text-gray-800 font-medium">
                  <FaCheck
                    className="bg-green-500 text-white p-1 rounded-full"
                    size={20}
                  />
                  {t("overview.feature_2_title")}
                </h3>
                <p className="pl-9 text-gray-500">
                  {t("overview.feature_2_desc")}
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-3 text-xl text-gray-800 font-medium">
                  <FaCheck
                    className="bg-green-500 text-white p-1 rounded-full"
                    size={20}
                  />
                  {t("overview.feature_3_title")}
                </h3>
                <p className="pl-9 text-gray-500">
                  {t("overview.feature_3_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
