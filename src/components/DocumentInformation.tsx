import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

interface DocumentInformationProps {
  score?: number;
  summaryPoints?: string[];
  sketchyClauses?: string[];
}

const DocumentInformation: React.FC<DocumentInformationProps> = ({
  score,
  summaryPoints,
  sketchyClauses,
}) => {
  return (
    <Box
      w="full"
      maxW="md"
      p={6}
      bg="white"
      borderRadius="lg"
      border="2px solid #E0E0E0"
      mt={4}
    >
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          Document Information
        </Text>
        {score !== undefined && (
          <Text
            color={
              score >= 75 ? "green.500" : score >= 50 ? "yellow.500" : "red.500"
            }
          >
            Score: {score}
          </Text>
        )}
        {summaryPoints && (
          <Box>
            <Text fontWeight="bold" mb={2}>
              Summary Points:
            </Text>
            <VStack align="start" spacing={1} pl={4}>
              {summaryPoints.map((point, index) => (
                <Text key={index} as="li" listStyleType="disc">
                  {point}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
        {sketchyClauses && (
          <Box mt={4}>
            <Text fontWeight="bold" mb={2}>
              Sketchy Clauses:
            </Text>
            <VStack align="start" spacing={1} pl={4}>
              {sketchyClauses.map((clause, index) => (
                <Text key={index} as="li" listStyleType="disc">
                  {clause}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default DocumentInformation;
