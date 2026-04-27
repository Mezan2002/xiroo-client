"use client";
import { User } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Button } from "@/components/ui/Button";

export default function IdentitySection({ currentUser, handleAvatarUpload }) {
  return (
    <div className="lg:col-span-4 space-y-10">
      <div className="sticky top-32 space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-black" />
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-black">Visual Identity</h3>
          </div>
          <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
            Your avatar serves as your prestige signature across the Xiroo ecosystem.
          </p>
        </div>
        <div className="relative group inline-block">
          <div className="relative w-48 h-48 border border-gray-100 p-2 bg-white transition-all duration-700 group-hover:border-black">
            <UserAvatar user={currentUser} className="w-full h-full text-4xl" />
            <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
              <ImageUploader onUploadSuccess={handleAvatarUpload} folder="avatars">
                <Button variant="ghost" className="text-white text-[10px] font-bold tracking-widest p-0 uppercase hover:bg-transparent">Edit Identity</Button>
              </ImageUploader>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black text-white flex items-center justify-center"><span className="text-[10px] font-bold italic">XO</span></div>
        </div>
      </div>
    </div>
  );
}
