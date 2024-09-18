"use client";

import React from "react";
import { FileUploader } from "@/components";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";

export default function App() {
  const bg = useColorModeValue(
    "var(--background, #252525)",
    "var(--background, #000000)"
  );
  const color = useColorModeValue(
    "var(--foreground, #252525)",
    "var(--foreground, #FFFFFF)"
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
      pt={10}
    >
      <Heading as="h1" size="4xl" color="white">
        LegalEase
      </Heading>
      <FileUploader />
    </Box>
  );
}
