"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Heading, VStack, Text, Spinner } from "@chakra-ui/react";
import ViewDoc from "./ViewDoc";
import {
  BboxInformation,
  LambdaTextractType,
  TextSummaryAndColor,
} from "@/types/document";

const FileUploader: React.FC = () => {
  const [textractResults, setTextractResults] = useState<string | null>(null);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [textractResultsUrl, setTextractResultsUrl] = useState<string | null>(
    null
  );
  const [uploadedFileUrl, setuploadedFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [documentInformation, setDocumentInformation] = useState<
    TextSummaryAndColor[] | null
  >(null);
  const [bboxInformation, setBboxInformation] = useState<
    BboxInformation[] | null
  >(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > 150 * 1024) {
      setErrorMessage("File size exceeds 150KB. Please upload a smaller file.");
      setSelectedFile(null);
    } else {
      setErrorMessage(null);
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setBboxInformation(null);
    setDocumentInformation(null);
    setTextractResults(null);
    setTextractResultsUrl(null);
    setuploadedFileUrl(null);
    setLoadingResults(true);

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
      setuploadedFileUrl(result?.url);
      setTextractResultsUrl(result?.url + "-results.json");
    };

    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    if (!textractResultsUrl || textractResults) return;

    let timerId: number | null;

    const pollResults = () => {
      fetch(textractResultsUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.blocks && data.blocks.length > 0) {
            const joinedText = data.blocks.map(
              (block: LambdaTextractType) => block.text
            );
            const bboxInfo = data.blocks.map((block: LambdaTextractType) => ({
              text: block.text,
              page: block.page,
              ...block.bbox,
            }));
            setTextractResults(joinedText);
            setBboxInformation(bboxInfo);
          } else {
            timerId = setTimeout(pollResults, 5000) as unknown as number;
          }
        })
        .catch((error) => {
          console.error("Error fetching results:", error);
          timerId = setTimeout(pollResults, 5000) as unknown as number;
        });
    };

    pollResults();

    return () => {
      // Clean up any pending timeouts when the component unmounts
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [textractResultsUrl, textractResults]);

  useEffect(() => {
    if (!textractResults) return;

    const fetchDocumentData = async () => {
      try {
        const response = await fetch("/api/getDocumentData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ textArray: textractResults }),
        });

        const data = await response.json();
        if (data.length > 0) {
          setDocumentInformation(data);
          setLoadingResults(false);
          setSelectedFile(null);
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    };

    fetchDocumentData();
  }, [textractResults]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      pt={10}
    >
      {loadingResults &&
        (!documentInformation || !bboxInformation || !uploadedFileUrl) && (
          <Spinner size="xl" mt={20} color="white" />
        )}
      {!loadingResults && (
        <Box
          w="500px"
          p={6}
          bg="white"
          borderRadius="lg"
          border="2px solid #E0E0E0"
        >
          <VStack spacing={4}>
            <Heading as="h1" size="lg">
              {documentInformation
                ? "Upload another file!"
                : "Upload your file!"}
            </Heading>
            <Box
              {...getRootProps()}
              width="450px"
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
            {errorMessage && <Text color="red.500">{errorMessage}</Text>}
            <Button colorScheme="blue" width="full" onClick={handleUpload}>
              Upload
            </Button>
          </VStack>
        </Box>
      )}
      {uploadedFileUrl && bboxInformation && documentInformation && (
        <ViewDoc
          pdfUrl={uploadedFileUrl}
          bboxInformation={bboxInformation}
          documentInformation={documentInformation}
        />
      )}
    </Box>
  );
};

export default FileUploader;
