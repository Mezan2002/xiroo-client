import React from "react";

export default function ReceiptTotals({ subtotal, delivery, totalPrice }) {
  return (
    <div
      style={{
        marginTop: "60px",
        padding: "40px",
        backgroundColor: "#F9F9F9",
        borderRadius: "0px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "400px",
        marginLeft: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          Subtotal
        </p>
        <p style={{ fontSize: "12px", fontWeight: "900" }}>৳{subtotal}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          Shipping
        </p>
        <p style={{ fontSize: "12px", fontWeight: "900" }}>৳{delivery}</p>
      </div>
      <div
        style={{ height: "1px", backgroundColor: "#DDD", margin: "10px 0" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: "900",
            textTransform: "uppercase",
            color: "#000",
          }}
        >
          Total Amount
        </p>
        <p
          style={{
            fontSize: "32px",
            fontWeight: "900",
            color: "#000",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          ৳{totalPrice}
        </p>
      </div>
    </div>
  );
}
