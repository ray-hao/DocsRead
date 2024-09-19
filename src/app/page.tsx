"use client";

import React from "react";
import { Box, useColorModeValue, Spinner } from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FileUploader } from "@/components/Files";
import { PageHeader } from "@/components/Navigation";

export default function App() {
  const { error, isLoading } = useUser();
  const bg = useColorModeValue(
    "var(--background, #252525)",
    "var(--background, #000000)"
  );
  const color = useColorModeValue(
    "var(--foreground, #252525)",
    "var(--foreground, #FFFFFF)"
  );

  if (isLoading || error)
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height={"100vh"}
        bg={bg}
        color={color}
        overflow="hidden"
        pt={10}
      >
        {isLoading ? (
          <Spinner size="xl" mt={20} color="white" />
        ) : (
          <h1>{error?.message}</h1>
        )}
      </Box>
    );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height={"100vh"}
      bg={bg}
      color={color}
      overflow="hidden"
    >
      <PageHeader />
      <FileUploader />
    </Box>
  );
}
