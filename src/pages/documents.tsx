import React, { useEffect, useState } from "react";
import { Box, useColorModeValue, Spinner, Heading } from "@chakra-ui/react";
import { PageHeader } from "@/components/Navigation";
import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0/client";
import ViewDoc from "@/components/Files/ViewDoc";
import { BboxInformation, TextSummaryAndColor } from "@/types/files";

export default function Test() {
  const { user, isLoading } = useUser();
  const [documents, setDocuments] = useState<
    {
      DocumentFileUrl: string;
      DocumentId: string;
      DocumentbboxInformation: BboxInformation[];
      DocumentInformation: TextSummaryAndColor[];
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const bg = useColorModeValue(
    "var(--background, #252525)",
    "var(--background, #000000)"
  );
  const color = useColorModeValue(
    "var(--foreground, #252525)",
    "var(--foreground, #FFFFFF)"
  );

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/getDocument?userId=${user.sub}`);
          const data = await response.json();
          setDocuments(data);
        } catch (error) {
          console.error("Error fetching documents:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocuments();
  }, [user]);

  if (isLoading || loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        bg={bg}
        color={color}
        overflow="scroll"
        pt={10}
        minH="100vh"
      >
        <Spinner size="xl" mt={20} color="white" />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>LegalEase</title>
      </Head>
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        paddingBottom="10vh"
        bg={bg}
        color={color}
      >
        <PageHeader />
        {documents && documents.length > 0 ? (
          documents.map((doc) => (
            <ViewDoc
              key={doc.DocumentId}
              pdfUrl={doc.DocumentFileUrl}
              bboxInformation={doc.DocumentbboxInformation as BboxInformation[]}
              documentInformation={
                doc.DocumentInformation as TextSummaryAndColor[]
              }
            />
          ))
        ) : (
          <Heading as="h1" size="lg" color="white" pt={10}>
            No Documents Yet!
          </Heading>
        )}
      </Box>
    </>
  );
}
