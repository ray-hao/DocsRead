"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Spinner,
  Link,
} from "@chakra-ui/react";
import ViewDoc from "./ViewDoc";
import {
  BboxInformation,
  LambdaTextractType,
  TextSummaryAndColor,
} from "@/types/files";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@auth0/nextjs-auth0/client";

const FileUploader: React.FC = () => {
  const { user } = useUser();

  const [textractResults, setTextractResults] = useState<string | null>(null);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [textractResultsUrl, setTextractResultsUrl] = useState<string | null>(
    null
  );
  const [uploadedFileUrl, setuploadedFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [databaseFileName, setDatabaseFileName] = useState<string | null>(null);

  const [documentInformation, setDocumentInformation] = useState<
    TextSummaryAndColor[] | null
  >(null);
  const [bboxInformation, setBboxInformation] = useState<
    BboxInformation[] | null
  >(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [returningFromAuth, setReturningFromAuth] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > 500 * 1024) {
      setErrorMessage("File size exceeds 500KB. Please upload a smaller file.");
      setSelectedFile(null);
    } else if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF files are allowed. Please upload a PDF file.");
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
    setDatabaseFileName(null);
    setReturningFromAuth(false);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result?.toString().split(",")[1];
      const uniqueFileName = `${uuidv4()}-${selectedFile.name}`;

      setDatabaseFileName(uniqueFileName);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: {
            name: uniqueFileName,
            type: selectedFile.type,
            data: base64data,
          },
        }),
      });

      const result = await response.json();
      setuploadedFileUrl(result?.url);
      setTextractResultsUrl(result?.url + "-results.json");

      if (!user) {
        localStorage.setItem(
          "pendingUpload",
          JSON.stringify({
            databaseFileName: uniqueFileName,
            uploadedFileUrl: result?.url,
            bboxInformation: null,
            documentInformation: null,
          })
        );
      }
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

            if (!user) {
              const pendingUpload = JSON.parse(
                localStorage.getItem("pendingUpload") || "{}"
              );
              localStorage.setItem(
                "pendingUpload",
                JSON.stringify({
                  ...pendingUpload,
                  bboxInformation: bboxInfo,
                  documentInformation: null,
                })
              );
            }
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
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [textractResultsUrl, textractResults, user]);

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

          if (!user) {
            const pendingUpload = JSON.parse(
              localStorage.getItem("pendingUpload") || "{}"
            );
            localStorage.setItem(
              "pendingUpload",
              JSON.stringify({
                ...pendingUpload,
                documentInformation: data,
              })
            );
          }
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    };

    fetchDocumentData();
  }, [textractResults, user]);

  useEffect(() => {
    if (
      databaseFileName &&
      uploadedFileUrl &&
      bboxInformation &&
      documentInformation &&
      user &&
      !returningFromAuth
    ) {
      const createDocument = async () => {
        try {
          const response = await fetch("/api/createDocument", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              databaseFileName,
              uploadedFileUrl,
              bboxInformation,
              documentInformation,
              userId: user.sub,
            }),
          });

          if (!response.ok) {
            console.error("Failed to add document");
          }
        } catch (error) {
          console.error("Error adding document:", error);
        }
      };

      createDocument();
    }
  }, [
    databaseFileName,
    uploadedFileUrl,
    bboxInformation,
    documentInformation,
    user,
    returningFromAuth,
  ]);

  useEffect(() => {
    if (user) {
      const pendingUpload = localStorage.getItem("pendingUpload");
      if (pendingUpload) {
        const {
          databaseFileName,
          uploadedFileUrl,
          bboxInformation,
          documentInformation,
        } = JSON.parse(pendingUpload);

        const createDocument = async () => {
          try {
            const response = await fetch("/api/createDocument", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                databaseFileName,
                uploadedFileUrl,
                bboxInformation,
                documentInformation,
                userId: user.sub,
              }),
            });

            if (!response.ok) {
              console.error("Failed to add document");
            } else {
              localStorage.removeItem("pendingUpload");
            }
          } catch (error) {
            console.error("Error adding document:", error);
          }
        };

        createDocument();
        setReturningFromAuth(true);
        setDatabaseFileName(databaseFileName);
        setuploadedFileUrl(uploadedFileUrl);
        setBboxInformation(bboxInformation);
        setDocumentInformation(documentInformation);
      }
    }
  }, [user]);

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
          <>
            <Spinner size="xl" mt={20} color="white" />
            <Text mt={10} color="white">
              Please wait, this may take a minute (Working on making this
              faster!)
            </Text>
          </>
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
      {uploadedFileUrl &&
        bboxInformation &&
        documentInformation &&
        (user ? (
          <ViewDoc
            pdfUrl={uploadedFileUrl}
            bboxInformation={bboxInformation}
            documentInformation={documentInformation}
          />
        ) : (
          <>
            <ViewDoc
              pdfUrl={uploadedFileUrl}
              bboxInformation={bboxInformation}
              documentInformation={documentInformation}
            />
            <Text color="white" mt={10}>
              Please{" "}
              <Link href="/api/auth/login">
                <Text as="a" textDecoration="underline" color="#3081cc">
                  login
                </Text>
              </Link>{" "}
              to save processed documents.
            </Text>
          </>
        ))}
    </Box>
  );
};

export default FileUploader;
