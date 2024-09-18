import type { Metadata } from "next";
import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalEase",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}
