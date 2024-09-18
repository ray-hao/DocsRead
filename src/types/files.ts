export interface DocumentInformation {
  score?: number;
  summaryPoints?: string[];
  sketchyClauses?: string[];
}

export interface BboxInformation {
  left: number;
  right: number;
  top: number;
  bottom: number;
  page: number;
  text: string;
}

export interface LambdaTextractType {
  text: string;
  bbox: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  page: number;
}

export interface DocumentHighlight {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  tooltip: string;
  page: number;
}

export interface TextSummaryAndColor {
  summary: string;
  color: string;
}
