"use client";
import React, { useState } from "react";
import { 
  Mail, 
  Send, 
  Calendar, 
  Users, 
  Save, 
  X, 
  AlertCircle,
  Clock,
  Eye,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import TiptapEditor from "@/components/admin/shared/TiptapEditor";

const Label = ({ children }) => (
  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-3 block">
    {children}
  </label>
);

const Input = ({ ...props }) => (
  <input 
    {...props}
    className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-100"
  />
);

const FormSection = ({ title, children, icon: Icon }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
      {Icon && <Icon size={16} className="text-zinc-400" />}
      <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="space-y-8">{children}</div>
  </div>
);

export default function NewsletterForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  title = "Campaign Drafting"
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    subject: initialData.subject || "",
    previewText: initialData.previewText || "",
    content: initialData.content || "",
    targetSegment: initialData.targetSegment || "All Subscribers",
    scheduledDate: initialData.scheduledDate || "",
    status: initialData.status || "Draft",
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (html) => {
    setFormData(prev => ({ ...prev, content: html }));
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-16">
          <FormSection title="Campaign Narrative" icon={Type}>
            <div className="space-y-12">
              <div className="space-y-4">
                <Label>Internal Campaign Title</Label>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Spring 2024 Collection Launch"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label>Email Subject Line</Label>
                  <input 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-100 rounded-none h-12 px-4 text-[13px] font-bold outline-none focus:border-black transition-all"
                    placeholder="The subject as seen by customers"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Preview Text</Label>
                  <input 
                    name="previewText"
                    value={formData.previewText}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-100 rounded-none h-12 px-4 text-[13px] font-medium outline-none focus:border-black transition-all"
                    placeholder="Short summary for inbox preview"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Visual Narrative" icon={Eye}>
            <div className="space-y-4">
              <Label>Email Content (HTML)</Label>
              <TiptapEditor 
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Start crafting your campaign narrative..."
              />
            </div>
          </FormSection>
        </div>

        {/* Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-zinc-50 border border-zinc-100 p-8 space-y-10">
            <FormSection title="Registry Status" icon={AlertCircle}>
              <div className="flex gap-2">
                {["Draft", "Scheduled", "Active"].map((status) => (
                  <button 
                    key={status}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status }))}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.status === status ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </FormSection>

            <FormSection title="Delivery Logic" icon={Calendar}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Scheduled Delivery</Label>
                  <div className="relative">
                    <input 
                      type="datetime-local"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-none h-10 px-3 text-[12px] font-bold outline-none focus:border-black transition-all"
                    />
                    <Clock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <select 
                    name="targetSegment"
                    value={formData.targetSegment}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-none h-10 px-3 text-[12px] font-bold outline-none focus:border-black appearance-none transition-all"
                  >
                    <option>All Subscribers</option>
                    <option>VIP Customers</option>
                    <option>Cart Abandoners</option>
                    <option>New Registered</option>
                  </select>
                </div>
              </div>
            </FormSection>

            <FormSection title="Audit Narrative" icon={Mail}>
              <div className="space-y-4 text-[12px] text-zinc-500 leading-relaxed font-medium">
                <p>This campaign will be dispatched to <span className="text-black font-bold">1,482 recipients</span> based on the current segment criteria.</p>
                <p className="text-[10px] text-zinc-400 italic">Dispatched campaigns cannot be retracted once they enter the delivery cycle.</p>
              </div>
            </FormSection>
          </div>
        </div>
      </div>

      {/* Global Actions */}
      <div className="pt-16 border-t border-zinc-100 flex justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="h-14 px-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-zinc-100 hover:text-black hover:border-black transition-all rounded-none"
        >
          Discard Draft
        </Button>
        <Button 
          onClick={() => onSubmit(formData)}
          className="h-14 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-none hover:bg-zinc-800 transition-all shadow-xl shadow-black/10"
        >
          Register Campaign Logic
        </Button>
      </div>
    </div>
  );
}
