"use client";
import DataTable from "@/components/admin/shared/DataTable";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Select } from "@/components/ui/Select";
import { ExternalLink, Search, Trash2, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUsers } from "@/hooks/api/useUsers";
import { useToast } from "@/hooks/useToast";

export default function AdminUsers() {
  const router = useRouter();
  const { toast } = useToast();
  const { useAllUsers, updateRole, deleteUser } = useUsers();
  const { data: rawUsers = [], isLoading: loading, refetch } = useAllUsers();


  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRoleUpdate = async (userId, newRole) => {
    updateRole.mutate({ id: userId, role: newRole }, {
      onSuccess: () => {
        toast.success(`Identity Elevated: Role set to ${newRole.toUpperCase()}.`);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to modify security clearance.");
      }
    });
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    deleteUser.mutate(selectedUser._id, {
      onSuccess: () => {
        toast.success("User Registry Purged Successfully.");
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to purge user record.");
      }
    });
  };

  const users = rawUsers;


  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const COLUMNS = [
    {
      key: "name",
      label: "Identity",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-[#37352F]">
            {item.firstName} {item.lastName}
          </span>
          <span className="text-[11px] text-[#37352F80]">{item.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Access Level",
      render: (item) => (
        <div className="w-[140px]">
          <Select
            size="sm"
            value={item.role}
            onChange={(val) => handleRoleUpdate(item._id, val)}
            options={[
              { value: "customer", label: "Customer" },
              { value: "admin", label: "Admin" },
            ]}
            className={
              item.role === "admin"
                ? "bg-emerald-50! border-emerald-200! text-emerald-700!"
                : "bg-gray-200! border-gray-200! text-gray-600!"
            }
          />
        </div>
      ),
    },
    {
      key: "tier",
      label: "Tier",
      render: (item) => {
        const tier = item.tier?.toLowerCase() || "bronze";
        const tierStyles = {
          bronze: "bg-[#CD7F3210] border-[#CD7F32] text-[#CD7F32]",
          silver: "bg-[#90909010] border-[#909090] text-[#909090]",
          gold: "bg-[#D4AF3710] border-[#D4AF37] text-[#D4AF37]",
          platinum: "bg-[#70809010] border-[#708090] text-[#708090]",
          diamond: "bg-[#B9F2FF20] border-[#70D1F1] text-[#0A4D68]",
        };
        return (
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border ${tierStyles[tier] || tierStyles.bronze}`}>
            {tier}
          </span>
        );
      },
    },
    {
      key: "authType",
      label: "Source",
      render: (item) => (
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
          {item.authType || "Standard"}
        </span>
      ),
    },
    {
      key: "points",
      label: "Engagement",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-black bg-gray-50 px-2 py-0.5 border border-gray-100">
            {item.points || 0} PTS
          </span>
          <div className="w-12 h-0.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-700"
              style={{ width: `${Math.min((item.points || 0) / 2, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => router.push(`/admin/users/${item._id}`)}
            className="p-2 text-[#37352F30] hover:text-[#37352F] transition-colors"
            title="View Analysis"
          >
            <ExternalLink size={14} />
          </button>
          <button
            onClick={() => {
              setSelectedUser(item);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-[#37352F30] hover:text-red-600 transition-colors"
            title="Purge Record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users", active: true },
        ]}
        title="User Registry"
        icon={Users}
        primaryAction={{
          label: "Add User",
          icon: UserPlus,
          onClick: () => router.push("/admin/users/new"),
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm group">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#37352F40] group-focus-within:text-[#37352F] transition-colors"
          />
          <input
            type="text"
            placeholder="Search registry by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#EDECE9] rounded-md py-2.5 pl-9 pr-4 text-[13px] outline-none transition-all focus:bg-white focus:border-black/20 placeholder:text-[#37352F40] font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-[170px]">
            <Select
              size="sm"
              variant="ghost"
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
              options={[
                { value: "all", label: "ALL CLEARANCES" },
                { value: "admin", label: "ADMIN REGISTRY" },
                { value: "customer", label: "CUSTOMER BASE" },
              ]}
              className="bg-white! border-[#EDECE9]!"
            />
          </div>

          <Button
            variant="secondary"
            className="h-10 text-[12px] font-bold tracking-wider"
            onClick={() => refetch()}
          >
            REFRESH SYNC
          </Button>

        </div>
      </div>

      <DataTable 
        columns={COLUMNS} 
        data={filteredUsers} 
        loading={loading} 
        className="min-h-[calc(100vh-300px)] bg-white border border-[#EDECE9] rounded-sm shadow-sm"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Purge User Registry?"
        message={`This will permanently remove ${selectedUser?.firstName} ${selectedUser?.lastName} from the platform. This action is irreversible.`}
        confirmText="PURGE PERMANENTLY"
        variant="danger"
      />
    </div>
  );
}
