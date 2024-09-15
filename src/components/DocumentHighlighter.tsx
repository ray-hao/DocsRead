import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

interface Highlight {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  tooltip: string;
  page: number;
}

interface DocumentHighlighterProps {
  highlights: Highlight[];
  children: ReactNode;
  numPages: number | null;
}

const DocumentHighlighter: React.FC<DocumentHighlighterProps> = ({
  highlights,
  numPages,
  children,
}) => {
  if (numPages === null) return;

  return (
    <Box position="relative" width="100%" height="100%">
      {highlights.map((highlight) => (
        <Box
          key={highlight.id}
          position="absolute"
          left={`${highlight.x}%`}
          top={`${
            highlight.y / numPages + (highlight.page - 1) * (100 / numPages)
          }%`}
          width={`${highlight.width}%`}
          height={`${highlight.height}%`}
          backgroundColor={highlight.color}
          opacity={0.5}
          _hover={{ opacity: 0.8 }}
          title={highlight.tooltip}
          zIndex={2}
        />
      ))}
      {children}
    </Box>
  );
};

export default DocumentHighlighter;
