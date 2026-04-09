"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function SocialAuthButton({ text = "GOOGLE IDENTITY", onClick }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={onClick}
      className="w-full rounded-none flex items-center justify-center gap-3 border-gray-200 hover:border-black hover:text-black transition-all group"
    >
      <div className="flex items-center gap-2">
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={16}
          height={16}
          className="w-4 h-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
        />
        <span className="tracking-[0.2em]">{text}</span>
      </div>
    </Button>
  );
}
