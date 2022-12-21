export interface TokenFile {
  name: string;
  fileHandle: FileSystemFileHandle | null;
  document: TokenDocument;
  assets: Record<string, unknown>;
}

export interface TokenDocument {
  id: string;
  name: string;
  version: number;
  // pages: Record<string, TDPage>
  // pageStates: Record<string, TLPageState>
  // assets: TDAssets
}
