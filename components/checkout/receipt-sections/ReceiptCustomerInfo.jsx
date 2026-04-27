import React from "react";

export default function ReceiptCustomerInfo({ order }) {
  return (
    <>
      {/* Status & ID Banner */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "30px 0",
          borderTop: "2px solid #000",
          borderBottom: "1px solid #EEE",
          marginBottom: "60px",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "bold",
              color: "#AAA",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "6px",
            }}
          >
            Purchase ID
          </p>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "900",
              margin: 0,
              fontFamily: "monospace",
            }}
          >
            {order.orderId}
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "bold",
              color: "#AAA",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "6px",
            }}
          >
            Status
          </p>
          <div
            style={{
              display: "inline-flex",
              padding: "4px 12px",
              backgroundColor: "#000",
              color: "#FFF",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Confirmed
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div style={{ marginBottom: "60px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: "bold",
            color: "#AAA",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "12px",
          }}
        >
          Billing To
        </p>
        <p style={{ fontSize: "22px", fontWeight: "900", margin: 0 }}>
          {order.user?.firstName || order.user?.name || "Customer"}
        </p>
        <p
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#666",
            marginTop: "4px",
          }}
        >
          {order.user?.email}
        </p>
      </div>
    </>
  );
}
