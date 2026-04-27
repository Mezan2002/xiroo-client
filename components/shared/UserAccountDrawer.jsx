"use client";
import { X } from "lucide-react";
import LoggedInProfile from "./user-account-sections/LoggedInProfile";
import LoggedOutLayout from "./user-account-sections/LoggedOutLayout";
import { useUserAccount } from "./user-account-sections/useUserAccount";

export function UserAccountDrawer({ isOpen, onClose }) {
  const {
    mounted, currentUser, isLoggedIn, orders, cartItemsCount, wishlistItemsCount,
    handleLogout, handleLoginRedirect, handleRegisterRedirect
  } = useUserAccount(isOpen, onClose);

  return (
    <div
      className={`fixed inset-0 z-[1001] transition-all duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} />

      <div className="absolute inset-0 flex justify-end overflow-hidden">
        <aside
          className={`h-full w-full sm:w-[450px] bg-white text-black shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isOpen ? "translate-x-0" : "translate-x-full"} relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className={`absolute top-8 right-8 z-50 p-2 rounded-full transition-all duration-300 ${isLoggedIn ? "text-zinc-400 hover:text-white hover:bg-white/10" : "text-zinc-400 hover:text-black hover:bg-zinc-100"}`}
          >
            <X className="w-5 h-5" />
          </button>

          {!mounted ? (
            <div className="flex h-full items-center justify-center">
              <div className="w-8 h-8 border-2 border-zinc-200 border-t-black animate-spin rounded-full" />
            </div>
          ) : (
            <div className="flex flex-col h-full font-montserrat">
              {isLoggedIn ? (
                <LoggedInProfile
                  currentUser={currentUser}
                  orders={orders}
                  wishlistItemsCount={wishlistItemsCount}
                  cartItemsCount={cartItemsCount}
                  handleLogout={handleLogout}
                  onClose={onClose}
                />
              ) : (
                <LoggedOutLayout
                  handleLoginRedirect={handleLoginRedirect}
                  handleRegisterRedirect={handleRegisterRedirect}
                />
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
