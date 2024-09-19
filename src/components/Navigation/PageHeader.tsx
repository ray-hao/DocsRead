import React from "react";
import { Box, Text, Button, Heading } from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/client";

const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      p={4}
      bg="#3081cc"
      color="white"
    >
      <Heading as="h1" size="lg">
        LegalEase
      </Heading>
      <Box>
        {user ? (
          <>
            <Text display="inline" mr={4}>
              Welcome, {user.name}
            </Text>
            <Button as="a" href="/api/auth/logout">
              Logout
            </Button>
          </>
        ) : (
          <Button as="a" href="/api/auth/login">
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header;
