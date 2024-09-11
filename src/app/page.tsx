import React from "react";
import { FileUploader } from "@/components";
import { Box } from "@chakra-ui/react";

export default function App() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
    >
      <FileUploader />
    </Box>
  );
}
