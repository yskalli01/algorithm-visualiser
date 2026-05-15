"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

type ThemeContextType = {
  toggleTheme: () => void;
  mode: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: "dark",
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        shape: {
          borderRadius: 14,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}