"use client";
import React from "react";
import { Percent, Hash, Calendar, Users, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDiscountForm } from "./sections/useDiscountForm";

const Label = ({ children }) => <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-3 block">{children}</label>;
const Input = (props) => <input {...props} className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4" />;

const FormSection = ({ title, children, icon: Icon }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">{Icon && <Icon size={16} className="text-zinc-400" />}<h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest">{title}</h3></div>
    <div className="space-y-8">{children}</div>
  </div>
);

export default function DiscountForm({ initialData = {}, onSubmit, onCancel, isLoading = false }) {
  const { formData, setFormData, handleChange, handleTypeChange } = useDiscountForm(initialData);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          <FormSection title="Core Identity" icon={Hash}>
            <div className="space-y-4"><Label>Coupon Registry Code</Label><Input name="code" value={formData.code} onChange={handleChange} placeholder="e.g. XIROO2024" /></div>
          </FormSection>

          <FormSection title="Discount Value" icon={Percent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label>Discount Strategy</Label>
                <div className="flex flex-col gap-2">
                  {["Percentage", "Fixed Amount", "Free Shipping"].map((type) => (
                    <button key={type} type="button" onClick={() => handleTypeChange(type)} className={`w-full flex items-center justify-between p-4 border transition-all ${formData.type === type ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}>
                      <span className="text-[11px] font-bold uppercase tracking-widest">{type}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label>{formData.type === 'Percentage' ? 'Discount Percentage (%)' : formData.type === 'Fixed Amount' ? 'Discount Amount (৳)' : 'Shipping Logic'}</Label>
                {formData.type === 'Free Shipping' ? <div className="h-16 flex items-center text-zinc-400 text-[13px] italic border-b border-zinc-100">Applying 100% shipping subsidy.</div> : <Input name="value" type="number" value={formData.value} onChange={handleChange} placeholder={formData.type === 'Percentage' ? "20" : "500"} />}
              </div>
            </div>
          </FormSection>

          <FormSection title="Requirements & Eligibility" icon={AlertCircle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4"><Label>Minimum Requirement</Label><select name="minRequirement" value={formData.minRequirement} onChange={handleChange} className="w-full bg-white border border-zinc-100 h-12 px-4 text-[13px] font-medium outline-none focus:border-black"><option value="None">No minimum requirement</option><option value="Amount">Minimum purchase amount (৳)</option><option value="Quantity">Minimum quantity of items</option></select></div>
              {formData.minRequirement !== "None" && <div className="space-y-4 animate-in fade-in slide-in-from-top-2"><Label>{formData.minRequirement === "Amount" ? "Threshold Amount (৳)" : "Threshold Quantity"}</Label><input name={formData.minRequirement === "Amount" ? "minAmount" : "minQty"} type="number" value={formData.minRequirement === "Amount" ? formData.minAmount : formData.minQty} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-100 h-12 px-4 text-[13px] font-bold outline-none focus:border-black" /></div>}
            </div>
          </FormSection>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="bg-zinc-50 border border-zinc-100 p-8 space-y-10">
            <FormSection title="Usage Governance" icon={Users}>
              <div className="space-y-6">
                <div className="space-y-2"><Label>Total Usage Limit</Label><input name="usageLimit" type="number" value={formData.usageLimit} onChange={handleChange} placeholder="Unlimited" className="w-full h-10 px-3 text-[12px] font-bold border border-zinc-200" /></div>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="limitPerCustomer" checked={formData.limitPerCustomer} onChange={handleChange} className="h-5 w-5 accent-black" /><span className="text-[12px] font-medium text-zinc-600">Limit to one use per customer</span></label>
              </div>
            </FormSection>
            <FormSection title="Promotion Timeline" icon={Calendar}>
              <div className="space-y-6">
                <div className="space-y-2"><Label>Launch Date</Label><div className="relative"><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full h-10 px-3 text-[12px] font-bold border border-zinc-200" /><Clock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300" /></div></div>
                <div className="space-y-2"><Label>Sunset Date (Optional)</Label><div className="relative"><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full h-10 px-3 text-[12px] font-bold border border-zinc-200" /><Calendar size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300" /></div></div>
              </div>
            </FormSection>
          </div>
        </div>
      </div>

      <div className="pt-16 border-t border-zinc-100 flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} className="h-14 px-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-zinc-100 hover:text-black">Discard Registry</Button>
        <Button onClick={() => onSubmit(formData)} disabled={isLoading} className="h-14 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800">{isLoading ? "Saving..." : "Save Promotional Logic"}</Button>
      </div>
    </div>
  );
}
