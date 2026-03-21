"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [layoutProps, setLayoutProps] = useState({
    imageSrc: "/images/auth/login.png",
    heading: "",
    description: "",
    badgeText: "",
  });

  const updateLayout = useCallback((props) => {
    setLayoutProps((prev) => ({ ...prev, ...props }));
  }, []);

  const value = useMemo(() => ({ layoutProps, updateLayout }), [layoutProps, updateLayout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthLayout() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthLayout must be used within an AuthProvider");
  }
  return context;
}
