"use client";
import React from "react";

export default function AdminInvoiceTemplate({ order, invoiceRef }) {
  if (!order) return null;

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = order.shippingFee || 0;

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
        ref={invoiceRef}
        style={{
          width: "100%",
          padding: "60px",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "60px",
            paddingBottom: "30px",
            borderBottom: "1px solid #E5E5E5",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              XIROO
            </h1>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#666",
                letterSpacing: "0.1em",
                marginTop: "8px",
                textTransform: "uppercase",
                margin: "8px 0 0",
              }}
            >
              INVOICE
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              Invoice Date
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                margin: "4px 0 0",
                color: "#333",
              }}
            >
              {date}
            </p>
          </div>
        </div>

        {/* Order Info & Customer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "50px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "600",
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Order ID
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "700",
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              {order.orderId}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "600",
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Bill To
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                margin: 0,
                color: "#333",
              }}
            >
              {order.user?.firstName || order.user?.name || "Customer"}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#666",
                margin: "2px 0 0",
              }}
            >
              {order.user?.email}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: "40px" }}>
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 100px 120px",
              gap: "20px",
              padding: "12px 0",
              borderBottom: "1px solid #E5E5E5",
            }}
          >
            {["Item", "Qty", "Price", "Total"].map((label, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                  textAlign: idx === 1 ? "center" : idx === 3 ? "right" : "left",
                }}
              >
                {label}
              </p>
            ))}
          </div>

          {/* Table Body */}
          {order.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 100px 120px",
                gap: "20px",
                padding: "16px 0",
                borderBottom: "1px solid #F5F5F5",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    margin: 0,
                    color: "#333",
                  }}
                >
                  {item.product?.title || "Product"}
                </p>
                {item.variant && item.variant !== "Standard" && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      marginTop: "2px",
                      margin: "2px 0 0",
                    }}
                  >
                    {item.variant}
                  </p>
                )}
              </div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: 0,
                  textAlign: "center",
                  color: "#333",
                }}
              >
                {item.quantity}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  margin: 0,
                  color: "#666",
                }}
              >
                ৳{item.price.toLocaleString()}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: 0,
                  textAlign: "right",
                  color: "#333",
                }}
              >
                ৳{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ width: "280px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  margin: 0,
                }}
              >
                Subtotal
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                ৳{subtotal.toLocaleString()}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  margin: 0,
                }}
              >
                Shipping
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                ৳{shipping.toLocaleString()}
              </p>
            </div>
            <div
              style={{
                borderTop: "1px solid #E5E5E5",
                marginTop: "8px",
                paddingTop: "12px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Total
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                ৳{order.totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "80px",
            paddingTop: "20px",
            borderTop: "1px solid #E5E5E5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              color: "#999",
              margin: 0,
            }}
          >
            Thank you for your purchase
          </p>
          <p
            style={{
              fontSize: "10px",
              color: "#999",
              margin: 0,
            }}
          >
            © 2026 XIROO. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
