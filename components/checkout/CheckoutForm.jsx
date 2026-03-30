/* eslint-disable react-hooks/set-state-in-effect */
import { useOrders } from "@/hooks/api/useOrders";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import SearchableDistrict from "../ui/SearchableDistrict";

export default function CheckoutForm({
  step,
  setStep,
  setProductDistrict,
  deliveryMethod,
  setDeliveryMethod,
  items,
  subtotal,
  shipping,
  total,
}) {
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

  // Pre-fill user data
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

  const handleNext = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      await handlePlaceOrder();
    }
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
        const orderId = response.data._id || response.data.id;
        router.push(`/checkout/success?id=${orderId}`);
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("DEBUG: Order Payload Sent:", {
        user: user?._id || user?.id,
        items,
        total,
        shipping,
        deliveryMethod,
        formData,
      });
      console.error("DEBUG: Backend Validation Error:", error.response?.data);

      const errorMessage =
        error.response?.data?.errorSources
          ?.map((err) => `${err.path}: ${err.message}`)
          .join(", ") ||
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";

      toast.error(errorMessage);
    }
  };

  const isSubmitting = placeOrder.isPending;

  return (
    <div className="space-y-12">
      {/* Steps Indicator */}
      <div className="flex flex-wrap gap-2 md:gap-8">
        {[
          { id: 1, label: "Information" },
          { id: 2, label: "Delivery" },
          { id: 3, label: "Payment" },
        ].map((s) => (
          <div key={s.id} className="flex items-center gap-2 md:gap-3">
            <span
              className={`text-[10px] md:text-[11px] font-bold uppercase tracking-widest ${step === s.id ? "text-black" : "text-gray-300"}`}
            >
              {s.label}
            </span>
            {s.id < 3 && <ChevronRight className="w-3 h-3 text-gray-200" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleNext} className="space-y-12">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <h2 className="text-[18px] font-bold uppercase tracking-widest">
                Contact Information
              </h2>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-[18px] font-bold uppercase tracking-widest">
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full h-14 px-6 bg-gray-50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full h-14 px-6 bg-gray-50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address or House No."
                className="w-full h-14 px-6 bg-gray-50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 px-6 pt-3 h-16 flex flex-col justify-center transition-all group focus-within:border-black focus-within:bg-white">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 block">
                    District
                  </label>
                  <SearchableDistrict
                    value={formData.district}
                    onChange={handleDistrictChange}
                    placeholder="Select District"
                    className="border-none! px-0! h-8! pt-0! min-h-0! flex items-center"
                  />
                </div>
                <div className="bg-gray-50 border border-gray-100 px-6 pt-3 h-16 flex flex-col justify-center transition-all group focus-within:border-black focus-within:bg-white">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 block">
                    Upazila / Thana
                  </label>
                  <input
                    type="text"
                    name="upazila"
                    required
                    value={formData.upazila}
                    onChange={handleChange}
                    placeholder="e.g. Banani"
                    className="w-full h-8 px-0 bg-transparent outline-none text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number (e.g. 017...)"
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="space-y-4">
              <h2 className="text-[18px] font-bold uppercase tracking-widest">
                Delivery Method
              </h2>
              <div className="border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                <label className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-3 sm:gap-0 cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      checked={deliveryMethod === "normal"}
                      onChange={() => setDeliveryMethod("normal")}
                      className="w-4 h-4 accent-black shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase tracking-widest leading-tight">
                        Normal Delivery
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                        2-3 business days
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold uppercase sm:text-right pl-8 sm:pl-0">Free</span>
                </label>
                <label className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-3 sm:gap-0 cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      checked={deliveryMethod === "fast"}
                      onChange={() => setDeliveryMethod("fast")}
                      className="w-4 h-4 accent-black shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase tracking-widest leading-tight">
                        Fast Delivery
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                        1 business day
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold uppercase sm:text-right pl-8 sm:pl-0">৳50</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="space-y-4">
              <h2 className="text-[18px] font-bold uppercase tracking-widest">
                Payment Method
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 sm:p-6 border border-black cursor-pointer bg-gray-50/50">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="w-4 h-4 accent-black shrink-0"
                  />
                  <span className="text-[13px] md:text-sm font-bold uppercase tracking-widest leading-tight mt-px">
                    Cash on Delivery
                  </span>
                </label>
                <label className="flex items-center gap-4 p-4 sm:p-6 border border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors opacity-50 grayscale">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="w-4 h-4 accent-black shrink-0"
                  />
                  <span className="text-[13px] md:text-sm font-bold uppercase tracking-widest leading-tight mt-px">
                    Credit Card (Coming Soon)
                  </span>
                </label>
                <label className="flex items-center gap-4 p-4 sm:p-6 border border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors opacity-50 grayscale">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="w-4 h-4 accent-black shrink-0"
                  />
                  <span className="text-[13px] md:text-sm font-bold uppercase tracking-widest leading-tight mt-px">
                    Mobile Banking (Coming Soon)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-100">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </div>
            ) : step === 3 ? (
              "Complete Purchase"
            ) : (
              "Continue to Delivery"
            )}
          </Button>
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setStep(step - 1)}
              className="sm:w-[200px]"
            >
              Back
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
