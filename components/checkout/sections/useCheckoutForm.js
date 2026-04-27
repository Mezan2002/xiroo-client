/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useOrders } from "@/hooks/api/useOrders";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useCheckoutForm = (
  step,
  setStep,
  setProductDistrict,
  items,
  total,
  shipping,
  deliveryMethod,
) => {
  const router = useRouter();
  const { user } = useUser();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const { placeOrder } = useOrders();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    upazila: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (user) {
      const defaultAddress =
        user.addresses?.find((addr) => addr.isDefault) || user.addresses?.[0];
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || user.name?.split(" ")[0] || prev.firstName,
        lastName:
          user.lastName ||
          user.name?.split(" ").slice(1).join(" ") ||
          prev.lastName,
        phone: user.phoneNumber || user.phone || prev.phone,
        address: defaultAddress
          ? `${defaultAddress.addressLine1}${defaultAddress.addressLine2 ? ", " + defaultAddress.addressLine2 : ""}`
          : prev.address,
        district: defaultAddress?.state || prev.district,
        upazila: defaultAddress?.city || prev.upazila,
        postalCode: defaultAddress?.postalCode || prev.postalCode,
      }));
      if (defaultAddress?.state && setProductDistrict) {
        setProductDistrict(defaultAddress.state);
      }
    }
  }, [user, setProductDistrict]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (val) => {
    setFormData((prev) => ({ ...prev, district: val }));
    if (setProductDistrict) setProductDistrict(val);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = items.map((item) => ({
        product: item.id || item._id,
        quantity: item.quantity,
        price: parseFloat(
          (item.salePrice || item.price)?.toString().replace(/[^0-9.]/g, "") ||
            0,
        ),
      }));

      const shippingAddress = `${formData.address}, ${formData.upazila}, ${formData.district} - ${formData.postalCode}`;

      const orderPayload = {
        user: user?._id || user?.id,
        items: orderItems,
        totalPrice: total,
        shippingFee: shipping,
        deliveryMethod: deliveryMethod,
        paymentMethod: formData.paymentMethod,
        shippingAddress: shippingAddress,
      };

      const response = await placeOrder.mutateAsync(orderPayload);
      if (response.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(
          `/checkout/success?id=${response.data._id || response.data.id}`,
        );
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred.",
      );
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      await handlePlaceOrder();
    }
  };

  return {
    formData,
    handleChange,
    handleDistrictChange,
    handleNext,
    isSubmitting: placeOrder.isPending,
  };
};
