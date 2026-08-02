"use client";
import { useOrders } from "@/hooks/api/useOrders";
import { useUser } from "@/hooks/api/useUser";
import { useAuth } from "@/hooks/api/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";


import { useCustomers } from "@/hooks/api/useCustomers";
import { saveCustomerContext } from "@/components/Marketing/FacebookPixel";

export const useCheckoutForm = (
  step,
  setStep,
  setProductDistrict,
  items,
  total,
  shipping,
  deliveryMethod,
  discount,
  discountAmount,
  note,
) => {
  const router = useRouter();
  const { user } = useUser();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const { placeOrder, placeGuestOrder } = useOrders();
  const { registerMutation } = useAuth();
  const { searchCustomerByPhone } = useCustomers();

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
    // Registration at checkout (only shown to guests on step 2)
    shouldRegister: false,
    password: "",
  });

  const [customerStats, setCustomerStats] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const phoneLookupTimeout = useRef(null);
  const isFormInitialized = useRef(false);

  // Pre-fill form if user is logged in (only once on initial load)
  useEffect(() => {
    if (user && !isFormInitialized.current) {
      isFormInitialized.current = true;
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

  // Phone lookup with debounce
  const lookupCustomer = useCallback(async (phone) => {
    if (!phone || phone.length < 11) {
      setCustomerStats(null);
      return;
    }

    setIsLookingUp(true);
    try {
      const result = await searchCustomerByPhone(phone);
      if (result) {
        setCustomerStats(result);
        // Auto-fill if customer found and fields are empty
        setFormData((prev) => ({
          ...prev,
          firstName: prev.firstName || result.firstName || "",
          lastName: prev.lastName || result.lastName || "",
          email: prev.email || result.emails?.[0] || "",
          address: prev.address || result.addresses?.[0]?.addressLine1 || "",
          district: prev.district || result.addresses?.[0]?.state || "",
          upazila: prev.upazila || result.addresses?.[0]?.city || "",
          postalCode: prev.postalCode || result.addresses?.[0]?.postalCode || "",
        }));
        // Update district for shipping calculation
        const district = result.addresses?.[0]?.state;
        if (district && setProductDistrict) {
          setProductDistrict(district);
        }
      } else {
        setCustomerStats(null);
      }
    } catch (err) {
      setCustomerStats(null);
    } finally {
      setIsLookingUp(false);
    }
  }, [searchCustomerByPhone, setProductDistrict]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      saveCustomerContext({
        email: updated.email,
        phone: updated.phone,
        firstName: updated.firstName,
        lastName: updated.lastName,
        city: updated.upazila,
        state: updated.district,
        zip: updated.postalCode,
      });
      return updated;
    });

    // Trigger phone lookup on phone change
    if (name === "phone") {
      if (phoneLookupTimeout.current) {
        clearTimeout(phoneLookupTimeout.current);
      }
      phoneLookupTimeout.current = setTimeout(() => {
        lookupCustomer(value);
      }, 500);
    }
  };

  const handleDistrictChange = (val) => {
    setFormData((prev) => {
      const updated = { ...prev, district: val };
      saveCustomerContext({ state: val });
      return updated;
    });
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
        multiItems: item.multiItems || undefined,
      }));

      const shippingAddress = `${formData.address}, ${formData.upazila}, ${formData.district} - ${formData.postalCode}`;

      const orderPayload = {
        user: user?._id || user?.id,
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        items: orderItems,
        totalPrice: total,
        shippingFee: shipping,
        deliveryMethod: deliveryMethod,
        paymentMethod: formData.paymentMethod,
        shippingAddress: shippingAddress,
        facebookEventId: "purchase_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now(),
        ...(discount && {
          discount: {
            code: discount.code,
            type: discount.type,
            value: discount.value,
          },
        }),
        ...(note && { note }),
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
    if (step < 2) {
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
    customerStats,
    isLookingUp,
    isSubmitting: placeOrder.isPending || placeGuestOrder.isPending || registerMutation.isPending,
  };
};
