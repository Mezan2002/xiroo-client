"use client";
import React from "react";
import ReceiptCustomerInfo from "./receipt-sections/ReceiptCustomerInfo";
import ReceiptFooter from "./receipt-sections/ReceiptFooter";
import ReceiptHeader from "./receipt-sections/ReceiptHeader";
import ReceiptItemsTable from "./receipt-sections/ReceiptItemsTable";
import ReceiptTotals from "./receipt-sections/ReceiptTotals";

export default function ReceiptTemplate({
  order,
  subtotal,
  delivery,
  receiptRef,
}) {
  if (!order) return null;

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "800px",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <div
        ref={receiptRef}
        style={{
          width: "100%",
          padding: "80px",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "'Montserrat', sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ReceiptHeader date={date} />
        
        <ReceiptCustomerInfo order={order} />

        <ReceiptItemsTable items={order.items} />

        <ReceiptTotals 
          subtotal={subtotal} 
          delivery={delivery} 
          totalPrice={order.totalPrice} 
        />

        <ReceiptFooter />
      </div>
    </div>
  );
}
