
export enum AppState {
  UPLOAD,
  GENERATING,
  RESULT,
}

export interface UploadedFile {
  base64: string;
  mimeType: string;
  name: string;
}
