"use client";
import SearchableDistrict from "@/components/ui/SearchableDistrict";

export default function InfoSection({ formData, handleChange, handleDistrictChange }) {
  return (
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
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full h-14 px-6 bg-gray-50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium"
          />
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
  );
}
