import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <ChakraButton colorScheme="blue" onClick={onClick}>
      {children}
    </ChakraButton>
  );
};

export default Button;
