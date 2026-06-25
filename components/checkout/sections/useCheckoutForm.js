/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useOrders } from "@/hooks/api/useOrders";
import { useUser } from "@/hooks/api/useUser";
import { useAuth } from "@/hooks/api/useAuth";
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
  const { placeOrder, placeGuestOrder } = useOrders();
  const { registerMutation } = useAuth();

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
    // Registration at checkout (only shown to guests on step 3)
    shouldRegister: false,
    password: "",
  });

  // Pre-fill form if user is logged in
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDistrictChange = (val) => {
    setFormData((prev) => ({ ...prev, district: val }));
    if (setProductDistrict) setProductDistrict(val);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = items.map((item) => ({
        product: item.id || item._id,
        variant: item.variant,
        quantity: item.quantity,
        price: parseFloat(
          (item.salePrice || item.price)?.toString().replace(/[^0-9.]/g, "") || 0,
        ),
        bundleId: item.bundleId || undefined,
      }));

      const shippingAddress = `${formData.address}, ${formData.upazila}, ${formData.district} - ${formData.postalCode}`;

      const orderPayload = {
        user: user?._id || user?.id,
        guestInfo: !user ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        } : undefined,
        // Always send customer snapshot data for both guest and logged-in users
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: orderItems,
        totalPrice: total,
        shippingFee: shipping,
        deliveryMethod: deliveryMethod,
        paymentMethod: formData.paymentMethod,
        shippingAddress: shippingAddress,
      };

      // Case 1: Guest wants to register
      if (!user && formData.shouldRegister && formData.password) {
        try {
          const regResponse = await registerMutation.mutateAsync({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          });
          
          if (regResponse.success) {
            // Save order to session storage to be placed after email verification
            if (typeof window !== "undefined") {
              sessionStorage.setItem("pending_order", JSON.stringify(orderPayload));
            }
            toast.success("Account created! Please verify your email to complete order.");
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}&flow=checkout&mode=otp`);
            return;
          }
        } catch (regErr) {
          toast.error(regErr.response?.data?.message || "Registration failed. Please try again.");
          return;
        }
      }

      // Case 2: Guest or Member places order directly
      const activeMutation = user ? placeOrder : placeGuestOrder;
      const response = await activeMutation.mutateAsync(orderPayload);
      
      if (response.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/checkout/success?id=${response.data._id || response.data.id}`);
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
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
    user,
    formData,
    handleChange,
    handleDistrictChange,
    handleNext,
    isSubmitting: placeOrder.isPending || placeGuestOrder.isPending || registerMutation.isPending,
  };
};
