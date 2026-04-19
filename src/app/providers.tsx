"use client";

import * as React from "react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useContext } from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// 🔹 ImageKit Auth Context
export const ImageKitAuthContext = createContext<{
  authenticate: () => Promise<{
    signature: string;
    token: string;
    expire: number;
  }>;
}>({
  authenticate: async () => ({
    signature: "",
    token: "",
    expire: 0,
  }),
});

export const useImageKitAuth = () => useContext(ImageKitAuthContext);

// 🔹 Authenticator function
const authenticator = async () => {
  try {
    const res = await fetch("/api/imagekit-auth");

    if (!res.ok) {
      throw new Error("Failed to fetch ImageKit auth");
    }

    return await res.json();
  } catch (error) {
    console.error("ImageKit auth error:", error);
    throw error;
  }
};

// 🔹 Providers Component
export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...themeProps}
    >
      <ImageKitAuthContext.Provider value={{ authenticate: authenticator }}>
        {children}
      </ImageKitAuthContext.Provider>
    </NextThemesProvider>
  );
}