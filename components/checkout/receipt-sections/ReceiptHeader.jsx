import React from "react";

export default function ReceiptHeader({ date }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "80px",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "900",
            letterSpacing: "-0.06em",
            margin: 0,
            textTransform: "uppercase",
            lineHeight: 0.8,
          }}
        >
          XIROO™
        </h1>
        <p
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#888",
            letterSpacing: "0.4em",
            marginTop: "12px",
            textTransform: "uppercase",
          }}
        >
          Registry Record
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: "bold",
            color: "#AAA",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          Date Issued
        </p>
        <p style={{ fontSize: "15px", fontWeight: "800", margin: "4px 0 0" }}>
          {date}
        </p>
      </div>
    </div>
  );
}
