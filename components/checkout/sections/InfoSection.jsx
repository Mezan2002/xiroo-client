"use client";
import SearchableDistrict from "@/components/ui/SearchableDistrict";
import LocationDropdown from "@/components/ui/LocationDropdown";
import { BANGLADESH_LOCATIONS } from "@/lib/bangladeshLocations";

export default function InfoSection({ formData, handleChange, handleDistrictChange, errors = {} }) {
  const thanas = formData.district ? (BANGLADESH_LOCATIONS[formData.district] || []) : [];

  const inputClass = (field) =>
    `w-full h-14 px-6 bg-gray-50 border focus:border-black focus:bg-white outline-none transition-all text-sm font-medium ${
      errors[field] ? "border-red-400 bg-red-50/30" : "border-gray-100"
    }`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <h2 className="text-[18px] font-medium uppercase tracking-wider">
          Contact Information
        </h2>
        <div className="space-y-2">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider ml-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className={inputClass("email")}
          />
          {errors.email && (
            <p className="text-[11px] text-red-500 font-medium ml-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-[18px] font-medium uppercase tracking-wider">
          Delivery Address
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className={inputClass("firstName")}
            />
            {errors.firstName && (
              <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className={inputClass("lastName")}
            />
            {errors.lastName && (
              <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address or House No."
            className={inputClass("address")}
          />
          {errors.address && (
            <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className={`bg-gray-50 border px-6 pt-3 h-16 flex flex-col justify-center transition-all group focus-within:border-black focus-within:bg-white ${errors.district ? "border-red-400 bg-red-50/30" : "border-gray-100"}`}>
              <label className="text-[9px] font-medium text-gray-400 uppercase tracking-wider leading-none mb-1 block">
                District
              </label>
              <SearchableDistrict
                value={formData.district}
                onChange={handleDistrictChange}
                placeholder="Select District"
                className="border-none! px-0! h-8! pt-0! min-h-0! flex items-center"
              />
            </div>
            {errors.district && (
              <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.district}</p>
            )}
          </div>
          <div>
            <div className={`bg-gray-50 border px-6 pt-3 h-16 flex flex-col justify-center transition-all group focus-within:border-black focus-within:bg-white ${errors.upazila ? "border-red-400 bg-red-50/30" : "border-gray-100"}`}>
              <label className="text-[9px] font-medium text-gray-400 uppercase tracking-wider leading-none mb-1 block">
                Upazila / Thana
              </label>
              <LocationDropdown
                value={formData.upazila}
                onChange={(val) => handleChange({ target: { name: "upazila", value: val } })}
                options={thanas}
                placeholder={formData.district ? "Select Thana" : "Select district first"}
                allowCustom
              />
            </div>
            {errors.upazila && (
              <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.upazila}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              className={inputClass("postalCode")}
            />
            {errors.postalCode && (
              <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.postalCode}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (e.g. 017...)"
              className={inputClass("phone")}
            />
            {errors.phone ? (
              <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.phone}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
