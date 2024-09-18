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
      justifyContent="center"
      height={"100vh"}
      bg={bg}
      color={color}
      p={4}
    >
      <Heading
        as="h1"
        size="4xl"
        color="white"
        position="absolute"
        top="0"
        mt="5vh"
      >
        LegalEase
      </Heading>
      <FileUploader />
    </Box>
  );
}
