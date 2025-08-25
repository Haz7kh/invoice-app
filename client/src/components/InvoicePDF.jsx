// src/components/InvoicePDF.jsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "100%",
  },
  section: {
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  customerBox: {
    border: "1pt solid #bbb",
    padding: 8,
    width: 180,
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    marginTop: 10,
    border: "1pt solid black",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid black",
  },
  tableHeaderText: {
    fontWeight: "bold",
    padding: 4,
    borderRight: "1pt solid black",
    fontSize: 10,
  },
  tableCell: {
    padding: 4,
    fontSize: 10,
    borderRight: "1pt solid black",
  },
  totalsBox: {
    alignSelf: "flex-end",
    marginTop: 10,
    width: 200,
    padding: 8,
    border: "1pt solid #000", // solid black border
    backgroundColor: "#fff", // optional: white background
  },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    marginBottom: 4,
  },
  totalsRowBold: {
    fontSize: 11,
    fontWeight: "bold",
  },
  footer: {
    fontSize: 9,
    borderTop: "1pt solid #ccc",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerCol: {
    width: "30%",
  },
});

const InvoicePDF = ({ invoice }) => {
  const { t } = useTranslation();
  if (!invoice) return null;

  const {
    companyFrom,
    customer,
    invoiceNumber,
    invoiceDate,
    dueDate,
    yourReference,
    ourReference,
    items,
    netTotal,
    vatTotal,
    grandTotal,
  } = invoice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexGrow: 1 }}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {companyFrom?.companyName || "SY Group AB"}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 10, textAlign: "right" }}>
                <Text style={styles.bold}>{t("invoice.title")}</Text>
                {"\n"}
                {t("invoice.number")} {invoiceNumber || "XXXX"}
              </Text>
              <View style={styles.customerBox}>
                <Text>{customer?.companyName || "Customer AB"}</Text>
                <Text>{customer?.billingAddress?.address || "Street 1"}</Text>
                <Text>
                  {customer?.billingAddress?.zip || "12345"}{" "}
                  {customer?.billingAddress?.city || "City"}
                </Text>
              </View>
            </View>
          </View>

          {/* DETAILS */}
          <View style={styles.section}>
            <Text>
              <Text style={styles.bold}>{t("invoice.date")}:</Text>{" "}
              {invoiceDate?.split("T")[0] || "-"}
            </Text>
            <Text>
              <Text style={styles.bold}>{t("invoice.delivery_date")}:</Text>{" "}
              {invoiceDate?.split("T")[0] || "-"}
            </Text>
            <Text>
              <Text style={styles.bold}>{t("invoice.due_date")}:</Text>{" "}
              {dueDate?.split("T")[0] || "-"}
            </Text>
            <Text>
              <Text style={styles.bold}>{t("invoice.your_ref")}:</Text>{" "}
              {yourReference || "-"}
            </Text>
            <Text>
              <Text style={styles.bold}>{t("invoice.our_ref")}:</Text>{" "}
              {ourReference || "-"}
            </Text>
            <Text style={{ marginTop: 6 }}>{t("invoice.late_fee")}</Text>
          </View>

          {/* ITEM TABLE */}

          <View style={{ marginTop: 10 }}>
            {/* Table Header Row */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#E5E7EB", // light gray
                borderTop: "1pt solid #bbb",
                borderBottom: "1pt solid #bbb",
              }}
            >
              {[
                { label: t("invoice.items.code"), align: "left", width: "20%" },
                { label: t("invoice.items.desc"), align: "left", width: "35%" },
                { label: t("invoice.items.qty"), align: "right", width: "10%" },
                {
                  label: t("invoice.items.unit"),
                  align: "right",
                  width: "10%",
                },
                {
                  label: t("invoice.items.price"),
                  align: "right",
                  width: "12.5%",
                },
                {
                  label: t("invoice.items.total"),
                  align: "right",
                  width: "12.5%",
                },
              ].map((col, i) => (
                <Text
                  key={i}
                  style={{
                    width: col.width,
                    paddingVertical: 6,
                    paddingHorizontal: 5,
                    fontWeight: "bold",
                    fontSize: 10.5,
                    textAlign: col.align,
                    borderRight: i < 5 ? "0.5pt solid #ccc" : "none",
                    color: "#111827",
                  }}
                >
                  {col.label}
                </Text>
              ))}
            </View>

            {/* Table Rows */}
            {items.map((item, index) => {
              const quantity = Number(item.quantity || 0);
              const price = Number(item.price || 0);
              const total = quantity * price;

              if (item.type === "text") {
                return (
                  <View
                    key={index}
                    style={{
                      padding: 8,
                      fontStyle: "italic",
                      fontSize: 10,
                      color: "#6B7280", // gray-500
                      borderBottom: "0.5pt solid #e5e7eb",
                    }}
                  >
                    <Text>{item.text}</Text>
                  </View>
                );
              }

              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderBottom: "0.5pt solid #e5e7eb",
                    backgroundColor: "#fff",
                  }}
                >
                  <Text style={{ width: "20%", padding: 6, fontSize: 10.2 }}>
                    {item.productCode || "-"}
                  </Text>
                  <Text style={{ width: "35%", padding: 6, fontSize: 10.2 }}>
                    {item.product || ""}
                  </Text>
                  <Text
                    style={{
                      width: "10%",
                      padding: 6,
                      fontSize: 10.2,
                      textAlign: "right",
                    }}
                  >
                    {quantity.toFixed(2)}
                  </Text>
                  <Text
                    style={{
                      width: "10%",
                      padding: 6,
                      fontSize: 10.2,
                      textAlign: "right",
                    }}
                  >
                    {item.unit || "st"}
                  </Text>
                  <Text
                    style={{
                      width: "12.5%",
                      padding: 6,
                      fontSize: 10.2,
                      textAlign: "right",
                    }}
                  >
                    {price.toLocaleString("sv-SE")}
                  </Text>
                  <Text
                    style={{
                      width: "12.5%",
                      padding: 6,
                      fontSize: 10.2,
                      textAlign: "right",
                    }}
                  >
                    {total.toLocaleString("sv-SE")}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        {/* TOTALS */}
        <View style={{ marginBottom: 30 }}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text>{t("invoice.totals.subtotal")}</Text>
              <Text>{netTotal?.toLocaleString("sv-SE") || "0.00"} kr</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text>
                {t("invoice.totals.vat")} ({items[0]?.vatPercent || 0} %):
              </Text>
              <Text>{vatTotal?.toFixed(2)} kr</Text>
            </View>
            <View
              style={[styles.totalsRow, styles.totalsRowBold, { marginTop: 6 }]}
            >
              <Text>{t("invoice.totals.grand")}</Text>
              <Text>{grandTotal?.toLocaleString("sv-SE")} kr</Text>
            </View>
          </View>
        </View>
        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.bold}>{t("invoice.footer.address")}</Text>
            <Text>{companyFrom?.companyName || "SY Group AB"}</Text>
            <Text>{companyFrom?.billingAddress?.address || "Gata 123"}</Text>
            <Text>
              {companyFrom?.billingAddress?.zip || "00000"}{" "}
              {companyFrom?.billingAddress?.city || "Stad"}
            </Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.bold}>{t("invoice.footer.email")}</Text>
            <Text>{companyFrom?.email || "info@example.com"}</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.bold}>{t("invoice.footer.org_number")}</Text>
            <Text>{companyFrom?.orgNumber || "559340-2679"}</Text>
            <Text>{t("invoice.footer.f_tax")}</Text>
            <Text>
              <Text style={styles.bold}>Bankgiro:</Text>{" "}
              {companyFrom?.bankgiro || "0000-0000"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
