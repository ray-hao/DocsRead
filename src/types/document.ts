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
