"use client";
import { useOrders } from "@/hooks/api/useOrders";

export const useOrderDetailLogic = (orderId) => {
  const { useOrderDetail } = useOrders();
  const { data: order, isLoading, error } = useOrderDetail(orderId);

  const orderData = order ? {
    id: order.orderNumber || order.orderId || order.id || orderId,
    date: new Date(order.createdAt || order.date || Date.now()).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    }),
    status: order.status || "PROCESSING",
    total: order.totalPrice || order.totalAmount || order.total || 0,
    items: order.items || [],
    shipping: order.shippingAddress || {},
    payment: order.paymentInfo || {},
  } : null;

  const shippingCost = order?.shippingFee || order?.shippingPrice || order?.shippingCost || 0;
  const subtotal = order?.itemsPrice || order?.subtotal || (orderData ? orderData.total - shippingCost : 0);

  return { orderData, subtotal, shippingCost, isLoading, error, order };
};
