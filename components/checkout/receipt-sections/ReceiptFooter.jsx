import React from "react";

export default function ReceiptFooter() {
  return (
    <div
      style={{
        marginTop: "100px",
        borderTop: "2px solid #000",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              margin: 0,
            }}
          >
            Authorized Signature
          </p>
          <div
            style={{
              width: "200px",
              height: "1px",
              backgroundColor: "#DDD",
              marginTop: "40px",
            }}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "bold",
              color: "#AAA",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            © 2026 XIROO
          </p>
          <p style={{ fontSize: "9px", color: "#CCC", marginTop: "4px" }}>
            Generated from the XIROO Distributed Registry System
          </p>
        </div>
      </div>
    </div>
  );
}
