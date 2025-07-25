"use client"

import { StoreProvider } from "@/store/providers/StoreProvider"

import { ThemeProvider } from "./ThemeProvider"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </StoreProvider>
  )
}

export { ThemeProvider }