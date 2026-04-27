"use client";

import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Plus } from "lucide-react";
import AddressCard from "./sections/AddressCard";
import AddressModal from "./sections/AddressModal";
import { useAddressesLogic } from "./sections/useAddressesLogic";

export default function AddressesPage() {
  const {
    currentUser, addresses, isModalOpen, setIsModalOpen, isDeleteModalOpen, setIsDeleteModalOpen,
    addressToDelete, setAddressToDelete, editingAddress, formData, setFormData,
    handleOpenModal, handleCloseModal, saveAddress, removeAddress
  } = useAddressesLogic();

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
          <AddressCard
            key={address._id || address.id}
            address={address}
            currentUser={currentUser}
            onEdit={() => handleOpenModal(address)}
            onDelete={() => {
              setAddressToDelete(address._id);
              setIsDeleteModalOpen(true);
            }}
          />
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

      <AddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingAddress={editingAddress}
        formData={formData}
        setFormData={setFormData}
        saveAddress={saveAddress}
      />

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
