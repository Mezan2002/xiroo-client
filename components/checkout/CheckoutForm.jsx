"use client";
import { Button } from "@/components/ui/Button";
import { Loader2, ChevronLeft, StickyNote } from "lucide-react";
import DeliverySection from "./sections/DeliverySection";
import InfoSection from "./sections/InfoSection";
import PaymentSection from "./sections/PaymentSection";
import StepIndicator from "./sections/StepIndicator";
import { useCheckoutForm } from "./sections/useCheckoutForm";

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
  discount,
  discountAmount,
  note,
  setNote,
  deliveryFeeData,
  hasFreeDelivery,
}) {
  const {
    user,
    formData,
    handleChange,
    handleDistrictChange,
    handleNext,
    customerStats,
    isSubmitting,
  } = useCheckoutForm(step, setStep, setProductDistrict, items, total, shipping, deliveryMethod, discount, discountAmount, note);

  return (
    <div className="space-y-12">
      <StepIndicator step={step} />

      <form onSubmit={handleNext} className="space-y-12">
        {step === 1 && (
          <InfoSection
            formData={formData}
            handleChange={handleChange}
            handleDistrictChange={handleDistrictChange}
            customerStats={customerStats}
          />
        )}

        {step === 2 && (
          <div className="space-y-10">
            <DeliverySection
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
              district={formData.district}
              deliveryFeeData={deliveryFeeData}
              hasFreeDelivery={hasFreeDelivery}
            />
            <PaymentSection
              user={user}
              formData={formData}
              handleChange={handleChange}
              customerStats={customerStats}
            />
          </div>
        )}

        {/* Order Notes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-gray-400" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Order Note (Optional)</span>
          </div>
          <textarea
            value={note || ""}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Special instructions for your order..."
            rows={3}
            className="w-full p-4 text-[13px] bg-gray-50 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all resize-none placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-10 border-t border-gray-100">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              showHoverIcon={false}
              onClick={() => setStep(step - 1)}
              className="sm:w-[200px] group flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-0 mr-0 opacity-0 group-hover:w-4 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
              Back
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </div>
            ) : step === 2 ? (
              "Complete Purchase"
            ) : (
              "Continue to Payment"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
