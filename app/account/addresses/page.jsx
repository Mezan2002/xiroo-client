"use client";

import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SearchableDistrict from "@/components/ui/SearchableDistrict";
import {
  Briefcase,
  Check,
  Edit3,
  Home,
  MapPin,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

import { useUser } from "@/hooks/api/useUser";
import { useToast } from "@/hooks/useToast";

export default function AddressesPage() {
  const { user: currentUser, syncAddresses } = useUser();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const addresses = currentUser?.addresses || [];

  const [formData, setFormData] = useState({

    address: "",
    district: "",
    upazila: "",
    zip: "",
    type: "HOME",
    isDefault: false,
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
        address: "",
        district: "",
        upazila: "",
        zip: "",
        type: "HOME",
        isDefault: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const saveAddress = () => {
    if (
      !formData.address ||
      !formData.district ||
      !formData.upazila ||
      !formData.zip
    ) {
      return toast.error(
        "Incomplete Parameters: Please provide all required shipping details.",
      );
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

    if (payload.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({
        ...a,
        isDefault: false,
      }));
    }

    if (editingAddress) {
      const idx = updatedAddresses.findIndex(
        (a) => a._id === editingAddress._id,
      );
      if (idx !== -1) updatedAddresses[idx] = payload;
    } else {
      updatedAddresses.push(payload);
    }

    if (updatedAddresses.length === 1) {
      updatedAddresses[0].isDefault = true;
    }

    syncAddresses.mutate(updatedAddresses, {
      onSuccess: () => {
        toast.success(editingAddress
          ? "Shipping Profile Updated."
          : "New Shipping Profile Added.");
        handleCloseModal();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to synchronize address registry.");
      }
    });
  };

  const removeAddress = (id) => {
    const updatedAddresses = addresses.filter((a) => a._id !== id);
    if (
      updatedAddresses.length > 0 &&
      addresses.find((a) => a._id === id)?.isDefault
    ) {
      updatedAddresses[0].isDefault = true;
    }
    syncAddresses.mutate(updatedAddresses, {
      onSuccess: () => {
        toast.success("Shipping Profile Removed.");
        setIsDeleteModalOpen(false);
        setAddressToDelete(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to synchronize address registry.");
      }
    });
  };


  const confirmDelete = (id) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getTypeIcon = (typeStr) => {
    const t = typeStr?.toUpperCase();
    switch (t) {
      case "HOME":
        return <Home className="w-4 h-4" />;
      case "OFFICE":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-xl md:text-2xl font-montserrat font-semibold">My Addresses</h2>
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-6 w-full sm:w-auto"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          ADD NEW ADDRESS
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {addresses.map((address) => (
          <div
            key={address._id || address.id}
            className="group relative p-5 sm:p-8 border border-black/5 hover:border-black transition-all duration-500 bg-white hover:shadow-2xl hover:shadow-black/5 flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] uppercase bg-zinc-900 text-white px-3 py-1.5 leading-none italic">
                  {getTypeIcon(address.type)}
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 text-gray-300 hover:text-black transition-colors"
                  title="Edit"
                  onClick={() => handleOpenModal(address)}
                >
                  <Edit3 className="w-4 h-4 stroke-[1.5]" />
                </button>
                <button
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  title="Remove"
                  onClick={() => confirmDelete(address._id)}
                >
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            </div>

            <h3 className="text-[15px] font-bold text-black mb-4 uppercase tracking-wide">
              {currentUser.firstName} {currentUser.lastName}
            </h3>

            <div className="space-y-3 text-[13px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider flex-1">
              <p className="flex items-center gap-2">
                <span className="text-gray-300">Phone:</span>{" "}
                {currentUser.phoneNumber}
              </p>
              <p>{address.addressLine1}</p>
              <p>
                {address.city}, {address.state}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-300">ZIP:</span> {address.postalCode}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-black" />
              <span className="text-[10px] text-black font-bold tracking-widest uppercase italic">
                Shipping Destination
              </span>
            </div>
          </div>
        ))}

        <button
          onClick={() => handleOpenModal()}
          className="flex flex-col items-center justify-center p-8 md:p-12 border border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-500 group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all">
            <Plus className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
          </div>
          <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">
            Add New Address
          </p>
        </button>
      </div>

      {/* Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-[600px] bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 sm:px-8 md:px-10 py-6 md:py-8 border-b border-gray-100 bg-white shrink-0">
              <h3 className="text-[16px] md:text-[20px] font-bold tracking-tight uppercase leading-tight">
                {editingAddress ? "Edit Address" : "ADD NEW ADDRESS"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form
                className="p-5 sm:p-8 md:p-10 space-y-8 md:space-y-10"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-200 py-3 text-[14px] focus:outline-none focus:border-black transition-colors uppercase tracking-tight font-medium"
                    placeholder="e.g. House 24, Road 12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none mb-2 block group-focus-within:text-black transition-colors">
                      District
                    </label>
                    <SearchableDistrict
                      value={formData.district}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, district: val }))
                      }
                      className={`h-12! px-0! text-sm font-medium border-b! ${formData.district ? "border-black!" : "border-gray-200"}`}
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none mb-2 block group-focus-within:text-black transition-colors">
                      Upazila / Thana
                    </label>
                    <input
                      type="text"
                      name="upazila"
                      value={formData.upazila}
                      onChange={handleInputChange}
                      className={`w-full h-12 bg-transparent border-b outline-none text-sm font-medium placeholder:text-gray-300 uppercase tracking-tight transition-all ${formData.upazila ? "border-black" : "border-gray-200"} focus:border-black`}
                      placeholder="e.g. Banani"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-gray-200 py-3 text-[14px] focus:outline-none focus:border-black transition-colors font-mono tracking-tight"
                      placeholder="XXXX"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Address Type
                    </label>
                    <div className="flex gap-2 sm:gap-4 pt-1">
                      {["HOME", "OFFICE", "OTHERS"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, type }))
                          }
                          className={`flex-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 sm:px-4 py-3 border transition-all truncate ${formData.type === type ? "bg-black text-white border-black" : "bg-transparent text-gray-400 border-gray-100 hover:border-black hover:text-black"}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-start gap-3 py-2 md:py-4 group cursor-pointer"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefault: !prev.isDefault,
                    }))
                  }
                >
                  <div
                    className={`w-5 h-5 border flex items-center justify-center transition-all ${formData.isDefault ? "bg-black border-black" : "border-gray-200 group-hover:border-black"}`}
                  >
                    {formData.isDefault && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                    Set as primary shipping address
                  </span>
                </div>
              </form>
            </div>

            <div className="p-5 sm:p-8 md:p-10 border-t border-gray-100 bg-white shrink-0">
              <Button
                variant="primary"
                className="w-full h-14 md:h-16 tracking-[0.2em] group text-[10px] md:text-[11px]"
                onClick={saveAddress}
              >
                {editingAddress ? "SAVE CHANGES" : "ADD ADDRESS"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => removeAddress(addressToDelete)}
        title="Remove Address?"
        message="This shipping destination will be permanently removed from your profile. This action cannot be undone."
        confirmLabel="Confirm Removal"
      />
    </div>
  );
}
