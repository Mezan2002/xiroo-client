import Image from "next/image";
import React from "react";

export default function ReceiptItemsTable({ items }) {
  return (
    <>
      {/* Table Head */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr 100px 120px",
          gap: "30px",
          paddingBottom: "15px",
          borderBottom: "2px solid #000",
          marginBottom: "20px",
        }}
      >
        {["Registry", "Item Description", "Quantity", "Amount"].map((label, idx) => (
          <p
            key={idx}
            style={{
              fontSize: "10px",
              fontWeight: "900",
              color: "#000",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: 0,
              textAlign: idx === 2 ? "center" : idx === 3 ? "right" : "left",
            }}
          >
            {label}
          </p>
        ))}
      </div>

      {/* Table Body */}
      <div style={{ flex: 1 }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 100px 120px",
              gap: "30px",
              alignItems: "center",
              padding: "25px 0",
              borderBottom: "1px solid #EEE",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#F7F7F7",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {item.product?.images?.[0] && (
                <Image
                  src={item.product.images[0]}
                  alt=""
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "900",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.product?.title}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#AAA",
                  marginTop: "4px",
                }}
              >
                REF: {item.product?._id?.toString().slice(-8).toUpperCase()}
              </p>
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "800",
                margin: 0,
                textAlign: "center",
              }}
            >
              {item.quantity}
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "900",
                margin: 0,
                textAlign: "right",
              }}
            >
              ৳{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
