"use client";

import React, { useState } from "react";
import { FileUploader } from "@/components";
import { Box, Input, Button, Text, VStack, Heading } from "@chakra-ui/react";

export default function App() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleLogin = () => {
    if (
      process.env.NEXT_PUBLIC_PASSWORD &&
      password === process.env.NEXT_PUBLIC_PASSWORD
    ) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <Box>
      {isAuthenticated ? (
        <FileUploader />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="100vh"
          bg="gray.50"
          p={4}
        >
          <VStack
            spacing={4}
            p={8}
            bg="white"
            borderRadius="md"
            boxShadow="md"
            w="full"
            maxW="sm"
          >
            <Heading size="lg" mb={4}>
              Access Restricted
            </Heading>
            <Text>Enter Password to Access</Text>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              mb={4}
              placeholder="Password"
            />
            <Button colorScheme="blue" onClick={handleLogin} w="full">
              Submit
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
