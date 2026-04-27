"use client";
import { useState, useEffect } from "react";
import { useLoyalty } from "@/hooks/api/useLoyalty";
import { useToast } from "@/hooks/useToast";

export const useLoyaltyManagement = () => {
  const { toast } = useToast();
  const { useLoyaltySettings, updateLoyaltySettings } = useLoyalty();
  const { data: fetchedSettings, isLoading } = useLoyaltySettings();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (fetchedSettings) setSettings(fetchedSettings);
  }, [fetchedSettings]);

  const handleUpdate = async () => {
    updateLoyaltySettings.mutate(settings, {
      onSuccess: () => toast.success("Loyalty Matrix Calibrated Successfully."),
      onError: (err) => toast.error(err.message || "Calibration Failure.")
    });
  };

  const updateTierConfig = (index, field, value) => {
    const newTierConfig = [...settings.tierConfig];
    newTierConfig[index] = { ...newTierConfig[index], [field]: value };
    setSettings({ ...settings, tierConfig: newTierConfig });
  };

  const addBenefit = (index) => {
    const newTierConfig = [...settings.tierConfig];
    newTierConfig[index].benefits.push("");
    setSettings({ ...settings, tierConfig: newTierConfig });
  };

  const removeBenefit = (tierIndex, benefitIndex) => {
    const newTierConfig = [...settings.tierConfig];
    newTierConfig[tierIndex].benefits.splice(benefitIndex, 1);
    setSettings({ ...settings, tierConfig: newTierConfig });
  };

  const updateBenefit = (tierIndex, benefitIndex, value) => {
    const newTierConfig = [...settings.tierConfig];
    newTierConfig[tierIndex].benefits[benefitIndex] = value;
    setSettings({ ...settings, tierConfig: newTierConfig });
  };

  return { settings, setSettings, isLoading, handleUpdate, updateTierConfig, addBenefit, removeBenefit, updateBenefit, isUpdating: updateLoyaltySettings.isPending };
};
