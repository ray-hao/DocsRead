import React, { ReactNode } from "react";
import { Box, Tooltip } from "@chakra-ui/react";
import { DocumentHighlight } from "@/types/document";

interface DocumentHighlighterProps {
  highlights: DocumentHighlight[];
  children: ReactNode;
  numPages: number | null;
}

const DocumentHighlighter: React.FC<DocumentHighlighterProps> = ({
  highlights,
  numPages,
  children,
}) => {
  return (
    <Box position="relative" width="100%" height="100%">
      {highlights.map((highlight) => (
        <Tooltip
          key={highlight.id}
          placement="right"
          label={highlight.tooltip}
          hasArrow
        >
          <Box
            key={highlight.id}
            position="absolute"
            left={`${highlight.x}%`}
            top={`${
              highlight.y / (numPages || 1) +
              (highlight.page - 1) * (100 / (numPages || 1))
            }%`}
            width={`${highlight.width}%`}
            height={`${highlight.height}%`}
            backgroundColor={highlight.color}
            opacity={0.5}
            _hover={{ opacity: 0.8 }}
            title={highlight.tooltip}
            zIndex={2}
          />
        </Tooltip>
      ))}
      {children}
    </Box>
  );
};

export default DocumentHighlighter;
