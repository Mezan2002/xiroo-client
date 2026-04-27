"use client";
import { useUser } from "@/hooks/api/useUser";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";

export const useAddressesLogic = () => {
  const { user: currentUser, syncAddresses } = useUser();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const addresses = currentUser?.addresses || [];

  const [formData, setFormData] = useState({
    address: "", district: "", upazila: "", zip: "", type: "HOME", isDefault: false,
  });

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        address: address.addressLine1 || "",
        district: address.state || "",
        upazila: address.city || "",
        zip: address.postalCode || "",
        type: (address.type || "home").toUpperCase(),
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        address: "", district: "", upazila: "", zip: "", type: "HOME", isDefault: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const saveAddress = () => {
    if (!formData.address || !formData.district || !formData.upazila || !formData.zip) {
      return toast.error("Incomplete Parameters: Please provide all required shipping details.");
    }

    const payload = {
      ...(editingAddress?._id ? { _id: editingAddress._id } : {}),
      type: formData.type.toLowerCase(),
      addressLine1: formData.address,
      city: formData.upazila,
      state: formData.district,
      postalCode: formData.zip,
      country: "Bangladesh",
      isDefault: formData.isDefault,
    };

    let updatedAddresses = [...addresses];
    if (payload.isDefault) updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));

    if (editingAddress) {
      const idx = updatedAddresses.findIndex(a => a._id === editingAddress._id);
      if (idx !== -1) updatedAddresses[idx] = payload;
    } else {
      updatedAddresses.push(payload);
    }
    if (updatedAddresses.length === 1) updatedAddresses[0].isDefault = true;

    syncAddresses.mutate(updatedAddresses, {
      onSuccess: () => {
        toast.success(editingAddress ? "Shipping Profile Updated." : "New Shipping Profile Added.");
        handleCloseModal();
      },
      onError: (err) => toast.error(err.message || "Failed to synchronize address registry.")
    });
  };

  const removeAddress = (id) => {
    const updatedAddresses = addresses.filter(a => a._id !== id);
    if (updatedAddresses.length > 0 && addresses.find(a => a._id === id)?.isDefault) {
      updatedAddresses[0].isDefault = true;
    }
    syncAddresses.mutate(updatedAddresses, {
      onSuccess: () => {
        toast.success("Shipping Profile Removed.");
        setIsDeleteModalOpen(false);
        setAddressToDelete(null);
      },
      onError: (err) => toast.error(err.message || "Failed to synchronize address registry.")
    });
  };

  return {
    currentUser, addresses, isModalOpen, setIsModalOpen, isDeleteModalOpen, setIsDeleteModalOpen,
    addressToDelete, setAddressToDelete, editingAddress, formData, setFormData,
    handleOpenModal, handleCloseModal, saveAddress, removeAddress
  };
};
