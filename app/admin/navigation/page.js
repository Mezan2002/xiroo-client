import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import MenuList from "@/components/admin/navigation/MenuList";
import { Layers } from "lucide-react";

export default function NavigationPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Navigation Mapping", active: true }
        ]}
        title="Navigation Menus" 
        icon={Layers}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-12">
          <MenuList />
        </div>
      </div>
    </div>
  );
}
