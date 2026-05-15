import type { Metadata } from "next";
import AppThemeProvider from "@/theme/ThemeContext";

export const metadata: Metadata = {
  title: "Realtime Algorithm Visualizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}