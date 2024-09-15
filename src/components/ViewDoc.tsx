import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import DocumentHighlighter from "./DocumentHighlighter";
import { Box } from "@chakra-ui/react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ViewDoc = ({
  pdfUrl,
  bboxInformation,
}: {
  pdfUrl: string;
  bboxInformation: {
    left: number;
    right: number;
    top: number;
    bottom: number;
    page: number;
  }[];
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const highlights = bboxInformation.map((bbox, index) => {
    return {
      id: index.toString(),
      x: bbox.left * 100,
      y: bbox.top * 100,
      width: (bbox.right - bbox.left) * 100,
      height: ((bbox.bottom - bbox.top) * 100) / (numPages || 1),
      color: "yellow",
      tooltip: `Highlight ${index + 1}`,
      page: bbox.page,
    };
  });

  return (
    <Box style={{ position: "relative" }}>
      <style jsx global>{`
        .react-pdf__Page__textContent {
          display: none !important;
        }
      `}</style>
      <Box
        maxHeight="50vh"
        overflowX="scroll"
        borderRadius="lg"
        border="2px solid #E0E0E0"
        mt="20px"
      >
        <DocumentHighlighter numPages={numPages} highlights={highlights}>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={index} pageNumber={index + 1} />
            ))}
          </Document>
        </DocumentHighlighter>
      </Box>
    </Box>
  );
};

export default ViewDoc;
