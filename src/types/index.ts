export interface User {
  id: number;
  username: string;
  email: string;
}

export interface File {
  id: number;
  userId: number;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  shortLink: string;
  password: string | null;
  downloadCount: number;
  expiresAt: string | null;
  createdAt: string;
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  totalDownloads: number;
  popularFiles: File[];
}

export interface AuthResponse {
  token: string;
  userId: number;
  username?: string;
}

export interface UploadResponse {
  id: number;
  shortLink: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  expiresAt: string | null;
}

export interface ShareFile {
  id: number;
  originalName: string;
  fileSize: number;
  mimeType: string;
  hasPassword: boolean;
  expiresAt: string | null;
}

export interface QRCodeResponse {
  qrCode: string;
  downloadUrl: string;
}
