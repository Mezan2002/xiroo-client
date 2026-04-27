"use client";
import { useUser } from "@/hooks/api/useUser";
import { useAuth } from "@/hooks/api/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useOrders } from "@/hooks/api/useOrders";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useUserAccount = (isOpen, onClose) => {
  const [mounted, setMounted] = useState(false);
  const { user: currentUser } = useUser();
  const { logout } = useAuth();
  const { itemCount: cartItemsCount } = useCart();
  const { itemCount: wishlistItemsCount } = useWishlist();
  const { useMyOrders } = useOrders();
  const router = useRouter();

  const isLoggedIn = !!currentUser;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: orders = [] } = useMyOrders({
    enabled: isLoggedIn && isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleLoginRedirect = () => {
    onClose();
    router.push("/login");
  };

  const handleRegisterRedirect = () => {
    onClose();
    router.push("/register");
  };

  return {
    mounted, currentUser, isLoggedIn, orders, cartItemsCount, wishlistItemsCount,
    handleLogout, handleLoginRedirect, handleRegisterRedirect
  };
};
