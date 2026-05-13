"use client";
import { useState } from "react";

export const useAdminSettings = () => {
  const [activeTab, setActiveTab] = useState("Operational");
  const [shipping, setShipping] = useState({
    freeThreshold: 5000,
    insideCity: 80,
    outsideCity: 120,
    fastDelivery: 50,
  });

  const TABS = ["Operational", "Marketing", "Security & API", "Billing"];

  return {
    activeTab, setActiveTab, shipping, setShipping, TABS
  };
};
