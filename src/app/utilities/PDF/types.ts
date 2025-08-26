/** Element used within data charts */
export interface DataChartElement {
  label: string;
  text: string;
  fullWidth?: boolean;
}

/** Single text block element */
export interface SingleElement {
  singletitle?: string;
  text: string;
  borderactive?: boolean;
}

/** Image element within the PDF */
export interface ImageElement {
  title: string;
  description?: string;
  urlimage: string;
  width?: string | number;
  height?: string | number;
}

/** Checkbox element */
export interface CheckElement {
  state: boolean;
  label?: string;
}

/** Signature representation */
export interface SignatureElement {
  name: string;
  charge?: string;
  signature?: string;
}

/** Data chart wrapper */
export interface DataChart {
  title: string;
  data: DataChartElement[];
}

/** Table configuration */
export interface Table {
  title: string;
  headers: string[];
  datatable: string[][];
  relation?: number[];
}

interface ImageList {
  title: string;
  pictures: ImageElement[];
}

interface CheckList {
  title: string;
  checks: CheckElement[];
}

interface SignatureChart {
  title: string;
  signatures: SignatureElement[];
}

/** List of string items */
export interface ListElement {
  title: string;
  items: string[];
}

/** Header information for documents */
export interface HeaderBox {
  docTitle: string;
  version: string;
  docType: string;
  docKey: string;
  creationDate?: string;
  lastVersionDate?: string;
}

/** Document page definition */
export interface newDocument {
  title?: string;
  folio?: string;
  progress?: string;
  orientation?: 'vertical' | 'horizontal';
  headerBox?: HeaderBox;
  elements: (SignatureChart | DataChart | ImageList | Table | CheckList | SingleElement | ListElement)[];
}

/** Full PDF document structure */
export interface FullDocument {
  pages: newDocument[];
}

export type PageElement = newDocument['elements'][number];
