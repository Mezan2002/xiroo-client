"use client";
import React from "react";
import { useStoreSettings } from "@/hooks/api/useStoreSettings";

export default function AdminInvoiceTemplate({ order, invoiceRef }) {
  const { settings: storeSettings } = useStoreSettings();
  const supportEmail = storeSettings?.contact?.supportEmail || "support@xirooshop.com";
  const phone = storeSettings?.contact?.phone || "+880 1XXX-XXXXXX";
  if (!order) return null;

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const shortDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = order.shippingFee || 0;

  // Compute bundle discount (10% when 2+ items share same bundleId)
  const bundleGroups = {};
  order.items.forEach((item) => {
    const itemSubtotal = item.price * item.quantity;
    if (item.bundleId) {
      if (!bundleGroups[item.bundleId]) {
        bundleGroups[item.bundleId] = { quantity: 0, subtotal: 0 };
      }
      bundleGroups[item.bundleId].quantity += item.quantity;
      bundleGroups[item.bundleId].subtotal += itemSubtotal;
    }
  });
  let bundleDiscountAmount = 0;
  Object.values(bundleGroups).forEach((group) => {
    if (group.quantity >= 2) {
      bundleDiscountAmount += group.subtotal * 0.10;
    }
  });

  const discount = order.discount || null;
  const couponDiscountAmount = discount?.amount ? Math.round(discount.amount * 100) / 100 : 0;
  const totalDiscount = bundleDiscountAmount + couponDiscountAmount;
  const total = order.totalPrice;

  const customerName =
    [order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") ||
    order.guestInfo
      ? `${order.guestInfo?.firstName || ""} ${order.guestInfo?.lastName || ""}`.trim()
      : "Customer";
  const customerEmail = order.user?.email || order.guestInfo?.email || "";
  const customerPhone = order.user?.phoneNumber || order.guestInfo?.phone || "";

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
          padding: "50px 55px",
          backgroundColor: "#ffffff",
          color: "#1a1a1a",
          fontFamily: "'Montserrat', 'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontSize: "12px",
          lineHeight: "1.5",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "50px",
          }}
        >
          {/* Logo */}
          <img
            src="/images/logo.png"
            alt="Xiroo"
            style={{ height: "40px", objectFit: "contain" }}
          />

          {/* Invoice Title + Date */}
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "28px", fontWeight: "800", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              INVOICE
            </p>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#888", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              DATE: {shortDate}
            </p>
          </div>
        </div>

        {/* ── Invoice To / Ship To ── */}
        <div
          style={{
            backgroundColor: "#f7f7f7",
            padding: "30px 35px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Invoice To */}
          <div>
            <p style={{ fontSize: "9px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }}>
              Invoice To
            </p>
            <p style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 8px", color: "#1a1a1a" }}>
              {customerName}
            </p>
            {customerPhone && (
              <p style={{ fontSize: "11px", color: "#666", margin: "0 0 3px" }}>{customerPhone}</p>
            )}
            {customerEmail && (
              <p style={{ fontSize: "11px", color: "#666", margin: 0 }}>{customerEmail}</p>
            )}
          </div>

          {/* Ship To */}
          <div>
            <p style={{ fontSize: "9px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }}>
              Ship To
            </p>
            <p style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 8px", color: "#1a1a1a" }}>
              {customerName}
            </p>
            <p style={{ fontSize: "11px", color: "#666", margin: 0, lineHeight: "1.6" }}>
              {order.shippingAddress || "No address provided"}
            </p>
          </div>
        </div>

        {/* ── Date + Invoice No ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: "2px solid #1a1a1a",
          }}
        >
          <p style={{ fontSize: "10px", fontWeight: "600", color: "#666", margin: 0, letterSpacing: "0.05em" }}>
            DATE: {date}
          </p>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "#1a1a1a", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Invoice No: {order.orderId}
          </p>
        </div>

        {/* ── Items Table ── */}
        <div style={{ marginBottom: "30px" }}>
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 90px 80px 100px",
              gap: "10px",
              padding: "12px 0",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            {["No", "Item Description", "Price", "Qty", "Total"].map((label, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: "9px",
                  fontWeight: "700",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: 0,
                  textAlign: idx === 0 ? "center" : idx === 2 || idx === 3 || idx === 4 ? "right" : "left",
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
                gridTemplateColumns: "40px 1fr 90px 80px 100px",
                gap: "10px",
                padding: "14px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: 0,
                  color: "#999",
                  textAlign: "center",
                }}
              >
                {idx + 1}.
              </p>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "600", margin: 0, color: "#1a1a1a" }}>
                  {item.product?.title || "Product"}
                </p>
                {item.variant && item.variant !== "Standard" && (
                  <p style={{ fontSize: "10px", color: "#999", margin: "2px 0 0" }}>
                    {item.variant}
                  </p>
                )}
              </div>
              <p style={{ fontSize: "12px", fontWeight: "500", margin: 0, textAlign: "right", color: "#444" }}>
                ৳{item.price.toLocaleString()}
              </p>
              <p style={{ fontSize: "12px", fontWeight: "600", margin: 0, textAlign: "right", color: "#444" }}>
                {item.quantity}
              </p>
              <p style={{ fontSize: "12px", fontWeight: "700", margin: 0, textAlign: "right", color: "#1a1a1a" }}>
                ৳{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* ── Totals ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
          <div style={{ width: "260px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <p style={{ fontSize: "11px", color: "#666", margin: 0, fontWeight: "500" }}>Subtotal:</p>
              <p style={{ fontSize: "11px", fontWeight: "700", margin: 0 }}>৳{subtotal.toLocaleString()}</p>
            </div>
            {bundleDiscountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <p style={{ fontSize: "11px", color: "#2a9d4e", margin: 0, fontWeight: "500" }}>
                  Bundle Discount (10%):
                </p>
                <p style={{ fontSize: "11px", fontWeight: "700", margin: 0, color: "#2a9d4e" }}>
                  -৳{bundleDiscountAmount.toLocaleString()}
                </p>
              </div>
            )}
            {discount && couponDiscountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <p style={{ fontSize: "11px", color: "#2a9d4e", margin: 0, fontWeight: "500" }}>
                  Discount ({discount.code || "Coupon"}):
                </p>
                <p style={{ fontSize: "11px", fontWeight: "700", margin: 0, color: "#2a9d4e" }}>
                  -৳{couponDiscountAmount.toLocaleString()}
                </p>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <p style={{ fontSize: "11px", color: "#666", margin: 0, fontWeight: "500" }}>Tax:</p>
              <p style={{ fontSize: "11px", fontWeight: "700", margin: 0 }}>0</p>
            </div>
            <div
              style={{
                borderTop: "2px solid #1a1a1a",
                marginTop: "8px",
                paddingTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", margin: 0, letterSpacing: "0.05em" }}>
                Grand Total:
              </p>
              <p style={{ fontSize: "16px", fontWeight: "800", margin: 0 }}>
                ৳{total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── Total Due ── */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 8px" }}>
            Total Due
          </p>
          <p style={{ fontSize: "32px", fontWeight: "800", margin: 0, letterSpacing: "-0.02em" }}>
            ৳{total.toLocaleString()}
          </p>
        </div>

        {/* ── Payment Info / Terms / Account Manager ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "30px",
            padding: "30px 0",
            borderTop: "1px solid #e0e0e0",
            marginBottom: "40px",
          }}
        >
          {/* Payment Info */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>
              Payment Info
            </p>
            <p style={{ fontSize: "10px", color: "#666", margin: "0 0 3px" }}>Payment Method: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</p>
            <p style={{ fontSize: "10px", color: "#666", margin: "0 0 3px" }}>Status: {order.paymentStatus || "Pending"}</p>
            {order.transactionId && (
              <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>Txn ID: {order.transactionId}</p>
            )}
          </div>

          {/* Terms */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>
              Terms &amp; Condition
            </p>
            <p style={{ fontSize: "10px", color: "#666", margin: 0, lineHeight: "1.7" }}>
              Payment is due upon delivery for COD orders. For online payments, the order is confirmed upon successful transaction. Returns are subject to Xiroo return policy.
            </p>
          </div>

          {/* Account Manager */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>
              Account Manager
            </p>
            <p style={{ fontSize: "10px", color: "#666", margin: "0 0 3px" }}>Xiroo Operations</p>
            <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>{supportEmail}</p>
          </div>
        </div>

        {/* ── Questions ── */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
            Questions?
          </p>
          <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>
            Email us at {supportEmail} or call us at {phone}
          </p>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            borderTop: "1px solid #e0e0e0",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            Dhaka, Bangladesh &middot; xirooshop.com
          </p>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span style={{ fontSize: "9px", color: "#aaa" }}>{supportEmail}</span>
            <span style={{ fontSize: "9px", color: "#aaa" }}>facebook</span>
            <span style={{ fontSize: "9px", color: "#aaa" }}>instagram</span>
          </div>
        </div>
      </div>
    </div>
  );
}
