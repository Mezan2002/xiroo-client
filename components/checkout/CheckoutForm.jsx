"use client";
import { Button } from "@/components/ui/Button";
import { Loader2, ChevronLeft } from "lucide-react";
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
}) {
  const {
    user,
    formData,
    handleChange,
    handleDistrictChange,
    handleNext,
    isSubmitting,
  } = useCheckoutForm(step, setStep, setProductDistrict, items, total, shipping, deliveryMethod);

  return (
    <div className="space-y-12">
      <StepIndicator step={step} />

      <form onSubmit={handleNext} className="space-y-12">
        {step === 1 && (
          <InfoSection
            formData={formData}
            handleChange={handleChange}
            handleDistrictChange={handleDistrictChange}
          />
        )}

        {step === 2 && (
          <DeliverySection
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            district={formData.district}
          />
        )}

        {step === 3 && (
          <PaymentSection
            user={user}
            formData={formData}
            handleChange={handleChange}
          />
        )}

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
            ) : step === 3 ? (
              "Complete Purchase"
            ) : (
              "Continue to Delivery"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
