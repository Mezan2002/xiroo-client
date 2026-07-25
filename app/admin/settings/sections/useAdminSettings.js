"use client";
import { useState, useEffect } from "react";
import { useDeliverySettings } from "@/hooks/api/useDeliverySettings";
import { useStoreSettings } from "@/hooks/api/useStoreSettings";
import { useLoyaltySettings } from "@/hooks/api/useLoyaltySettings";

export const useAdminSettings = () => {
  const { settings: deliverySettings, updateSettings: updateDelivery } = useDeliverySettings();
  const { settings: storeSettings, updateSettings: updateStore } = useStoreSettings();
  const { settings: loyaltySettings, updateSettings: updateLoyalty } = useLoyaltySettings();

  // Delivery
  const [shipping, setShipping] = useState({
    insideCity: 80,
    insideFast: 130,
    outsideCity: 150,
    outsideFast: 200,
    freeThreshold: 0,
  });
  const [customRates, setCustomRates] = useState([]);

  // Store Identity
  const [identity, setIdentity] = useState({
    name: "XIROO",
    tagline: "",
    domain: "xiroo.shop",
    logo: "",
  });
  const [contact, setContact] = useState({
    supportEmail: "support@xirooshop.com",
    infoEmail: "",
    whatsapp: "",
    phone: "",
  });
  const [social, setSocial] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
  });

  // Bundle Rules
  const [bundleRules, setBundleRules] = useState({
    discountPercentage: 10,
    quantityForDiscount: 2,
    quantityForFreeShipping: 3,
  });

  // Loyalty
  const [loyalty, setLoyalty] = useState({
    pointsPerHundred: 1,
    pointsPerOrder: 20,
    tierConfig: [],
  });

  // Policies
  const [policies, setPolicies] = useState({
    returnWindowDays: 7,
    refundPolicy: "",
    advancePaymentThreshold: 0,
    advancePaymentPercentage: 50,
  });

  useEffect(() => {
    if (deliverySettings) {
      setShipping({
        insideCity: deliverySettings.defaultInsideDhaka?.normal || 80,
        insideFast: deliverySettings.defaultInsideDhaka?.fast || 130,
        outsideCity: deliverySettings.defaultOutsideDhaka?.normal || 150,
        outsideFast: deliverySettings.defaultOutsideDhaka?.fast || 200,
        freeThreshold: deliverySettings.freeShippingThreshold || 0,
      });
      setCustomRates(deliverySettings.customRates || []);
    }
  }, [deliverySettings]);

  useEffect(() => {
    if (storeSettings) {
      setIdentity(storeSettings.identity || {});
      setContact(storeSettings.contact || {});
      setSocial(storeSettings.social || {});
      setBundleRules(storeSettings.bundleRules || {});
      setPolicies(storeSettings.policies || {});
    }
  }, [storeSettings]);

  useEffect(() => {
    if (loyaltySettings) {
      setLoyalty({
        pointsPerHundred: loyaltySettings.pointsPerHundred || 1,
        pointsPerOrder: loyaltySettings.pointsPerOrder || 20,
        tierConfig: loyaltySettings.tierConfig || [],
      });
    }
  }, [loyaltySettings]);

  const isSaving = updateDelivery.isPending || updateStore.isPending || updateLoyalty.isPending;

  const saveAll = () => {
    updateDelivery.mutate({
      freeShippingThreshold: Number(shipping.freeThreshold) || 0,
      defaultInsideDhaka: {
        normal: Number(shipping.insideCity) || 80,
        fast: Number(shipping.insideFast) || 130,
      },
      defaultOutsideDhaka: {
        normal: Number(shipping.outsideCity) || 150,
        fast: Number(shipping.outsideFast) || 200,
      },
      customRates,
    });

    updateStore.mutate({
      identity,
      contact,
      social,
      bundleRules: {
        discountPercentage: Number(bundleRules.discountPercentage) || 10,
        quantityForDiscount: Number(bundleRules.quantityForDiscount) || 2,
        quantityForFreeShipping: Number(bundleRules.quantityForFreeShipping) || 3,
      },
      policies: {
        returnWindowDays: Number(policies.returnWindowDays) || 7,
        refundPolicy: policies.refundPolicy,
        advancePaymentThreshold: Number(policies.advancePaymentThreshold) || 0,
        advancePaymentPercentage: Number(policies.advancePaymentPercentage) || 50,
      },
    });

    updateLoyalty.mutate({
      pointsPerHundred: Number(loyalty.pointsPerHundred) || 1,
      pointsPerOrder: Number(loyalty.pointsPerOrder) || 20,
      tierConfig: loyalty.tierConfig,
    });
  };

  const addCustomRate = (rate) => {
    setCustomRates((prev) => {
      const existing = prev.findIndex((r) => r.district.toLowerCase() === rate.district.toLowerCase());
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = rate;
        return updated;
      }
      return [...prev, rate];
    });
  };

  const removeCustomRate = (district) => {
    setCustomRates((prev) => prev.filter((r) => r.district !== district));
  };

  const updateTierConfig = (index, field, value) => {
    setLoyalty((prev) => {
      const updated = [...prev.tierConfig];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, tierConfig: updated };
    });
  };

  return {
    // Delivery
    shipping, setShipping, customRates, addCustomRate, removeCustomRate,
    // Identity
    identity, setIdentity, contact, setContact, social, setSocial,
    // Bundle
    bundleRules, setBundleRules,
    // Loyalty
    loyalty, setLoyalty, updateTierConfig,
    // Policies
    policies, setPolicies,
    // Save
    saveAll, isSaving,
  };
};
