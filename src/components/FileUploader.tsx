"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
// ... existing code ...

const FileUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result?.toString().split(",")[1];

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: {
            name: selectedFile.name,
            type: selectedFile.type,
            data: base64data,
          },
        }),
      });

      const result = await response.json();
      console.log(result);
    };

    reader.readAsDataURL(selectedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="background"
      color="foreground"
      p={4}
    >
      <Box
        w="full"
        maxW="md"
        p={6}
        bg="white"
        borderRadius="lg"
        border="2px solid #E0E0E0"
      >
        <VStack spacing={4}>
          <Heading as="h2" size="lg">
            Upload your file
          </Heading>
          <Box
            {...getRootProps()}
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            cursor="pointer"
            bg={isDragActive ? "gray.100" : "white"}
          >
            <input
              {...getInputProps()}
              type="file"
              style={{ display: "none" }}
            />
            {isDragActive ? (
              <Text>Drop the files here ...</Text>
            ) : (
              <Text>
                {selectedFile
                  ? selectedFile.name
                  : "Drag and drop some files here, or click to select files"}
              </Text>
            )}
          </Box>
          <Button colorScheme="blue" width="full" onClick={handleUpload}>
            Upload
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default FileUploader;
