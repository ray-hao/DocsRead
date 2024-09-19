import React, { useEffect } from "react";
import { Box, Text, Button, Heading } from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/client";

const Header: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    const createUser = async () => {
      if (user) {
        try {
          // Check if the user already exists
          const checkResponse = await fetch(`/api/getUser?userId=${user.sub}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const checkData = await checkResponse.json();
          console.log("HI", checkData);

          if (!checkData) {
            // If the user does not exist, create the user
            const response = await fetch("/api/createUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                UserId: user.sub,
              }),
            });

            if (!response.ok) {
              console.error("Failed to create user");
            }
          }
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    };

    createUser();
  }, [user]);

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
