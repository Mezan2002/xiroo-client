"use client";

export default function ReceiptTemplate({ order, subtotal, delivery, receiptRef }) {
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
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "80px" }}>
          <div>
            <h1 style={{ fontSize: "42px", fontWeight: "900", letterSpacing: "-0.06em", margin: 0, textTransform: "uppercase", lineHeight: 0.8 }}>XIROO™</h1>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#888", letterSpacing: "0.4em", marginTop: "12px", textTransform: "uppercase" }}>Registry Record</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Date Issued</p>
            <p style={{ fontSize: "15px", fontWeight: "800", margin: "4px 0 0" }}>{date}</p>
          </div>
        </div>

        {/* Status & ID Banner */}
        <div style={{ display: "flex", gap: "40px", padding: "30px 0", borderTop: "2px solid #000", borderBottom: "1px solid #EEE", marginBottom: "60px" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Purchase ID</p>
            <p style={{ fontSize: "20px", fontWeight: "900", margin: 0, fontFamily: "monospace" }}>{order.orderId}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Status</p>
            <div style={{ display: "inline-flex", padding: "4px 12px", backgroundColor: "#000", color: "#FFF", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Confirmed
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ marginBottom: "60px" }}>
          <p style={{ fontSize: "10px", fontWeight: "bold", color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Billing To</p>
          <p style={{ fontSize: "22px", fontWeight: "900", margin: 0 }}>{order.user?.firstName || order.user?.name || "Customer"}</p>
          <p style={{ fontSize: "14px", fontWeight: "500", color: "#666", marginTop: "4px" }}>{order.user?.email}</p>
        </div>

        {/* Table Head */}
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px 120px", gap: "30px", paddingBottom: "15px", borderBottom: "2px solid #000", marginBottom: "20px" }}>
          <p style={{ fontSize: "10px", fontWeight: "900", color: "#000", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Registry</p>
          <p style={{ fontSize: "10px", fontWeight: "900", color: "#000", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Item Description</p>
          <p style={{ fontSize: "10px", fontWeight: "900", color: "#000", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0, textAlign: "center" }}>Quantity</p>
          <p style={{ fontSize: "10px", fontWeight: "900", color: "#000", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0, textAlign: "right" }}>Amount</p>
        </div>

        {/* Table Body */}
        <div style={{ flex: 1 }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px 120px", gap: "30px", alignItems: "center", padding: "25px 0", borderBottom: "1px solid #EEE" }}>
              <div style={{ width: "80px", height: "80px", backgroundColor: "#F7F7F7", overflow: "hidden" }}>
                <img 
                  src={item.product?.images?.[0]} 
                  alt="" 
                  crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: "900", margin: 0, textTransform: "uppercase", letterSpacing: "-0.01em" }}>{item.product?.title}</p>
                <p style={{ fontSize: "12px", fontWeight: "bold", color: "#AAA", marginTop: "4px" }}>REF: {item.product?._id?.toString().slice(-8).toUpperCase()}</p>
              </div>
              <p style={{ fontSize: "16px", fontWeight: "800", margin: 0, textAlign: "center" }}>{item.quantity}</p>
              <p style={{ fontSize: "16px", fontWeight: "900", margin: 0, textAlign: "right" }}>৳{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ marginTop: "60px", padding: "40px", backgroundColor: "#F9F9F9", borderRadius: "0px", display: "flex", flexDirection: "column", gap: "15px", width: "400px", marginLeft: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888", textTransform: "uppercase" }}>Subtotal</p>
            <p style={{ fontSize: "12px", fontWeight: "900" }}>৳{subtotal}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888", textTransform: "uppercase" }}>Shipping</p>
            <p style={{ fontSize: "12px", fontWeight: "900" }}>৳{delivery}</p>
          </div>
          <div style={{ height: "1px", backgroundColor: "#DDD", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <p style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", color: "#000" }}>Total Amount</p>
            <p style={{ fontSize: "32px", fontWeight: "900", color: "#000", letterSpacing: "-0.04em", lineHeight: 1 }}>৳{order.totalPrice}</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "100px", borderTop: "2px solid #000", paddingTop: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>Authorized Signature</p>
              <div style={{ width: "200px", height: "1px", backgroundColor: "#DDD", marginTop: "40px" }} />
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em" }}>© 2026 XIROO STUDIO</p>
              <p style={{ fontSize: "9px", color: "#CCC", marginTop: "4px" }}>Generated from the XIROO Distributed Registry System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
