import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import DocumentHighlighter from "./DocumentHighlighter";
import { Box } from "@chakra-ui/react";
import { BboxInformation, TextSummaryAndColor } from "@/types/files";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const ViewDoc = ({
  pdfUrl,
  bboxInformation,
  documentInformation,
}: {
  pdfUrl: string;
  bboxInformation: BboxInformation[];
  documentInformation: TextSummaryAndColor[];
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
      color: documentInformation[index].color,
      tooltip: documentInformation[index].summary,
      page: bbox.page,
    };
  });

  return (
    <Box pt={10}>
      <style jsx global>{`
        hr {
          margin: 0;
          border: none;
          border-top: 1px solid #e0e0e0;
        }
      `}</style>
      <Box
        maxHeight="50vh"
        overflowX="scroll"
        borderRadius="lg"
        border="2px solid #E0E0E0"
      >
        <DocumentHighlighter numPages={numPages} highlights={highlights}>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Box key={index}>
                <Page
                  key={index}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                />
                {index < (numPages || 1) - 1 && <hr />}
              </Box>
            ))}
          </Document>
        </DocumentHighlighter>
      </Box>
    </Box>
  );
};

export default ViewDoc;
