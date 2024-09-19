import type { Metadata } from "next";
import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
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
      <UserProvider>
        <body className={`antialiased`}>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </body>
      </UserProvider>
    </html>
  );
}
