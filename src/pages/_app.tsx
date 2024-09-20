import type { Metadata } from "next";
import { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../app/theme";
import "../app/globals.css";

export const metadata: Metadata = {
  title: "LegalEase",
  description: "",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </UserProvider>
  );
}

export default MyApp;
