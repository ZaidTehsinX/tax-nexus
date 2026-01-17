// Shared types for Tax Nexus frontend

export interface FolderPath {
  path: string;
  name: string;
}

export interface CreateReturnsFoldersResponse {
  success: boolean;
  results: {
    folderPath: string;
    created: boolean;
    alreadyExists: boolean;
    error?: string;
  }[];
}

export interface MoveReturnFilesResponse {
  success: boolean;
  results: {
    folderPath: string;
    filesMoved: number;
    files: string[];
    error?: string;
  }[];
  totalFilesMoved: number;
}

export interface DeleteReturnFoldersResponse {
  success: boolean;
  results: {
    folderPath: string;
    foldersDeleted: number;
    deletedFolders: string[];
    error?: string;
  }[];
  totalFoldersDeleted: number;
}

export interface ClientFileResult {
  clientName: string;
  clientPath: string;
  hasFile: boolean;
  filePath?: string;
}

export interface SearchFilesResponse {
  success: boolean;
  fileName: string;
  totalClients: number;
  clientsWithFile: ClientFileResult[];
  clientsWithoutFile: ClientFileResult[];
}

export interface ComparisonClient {
  clientName: string;
  clientPath: string;
  hasFile1: boolean;
  hasFile2: boolean;
  file1Path?: string;
  file2Path?: string;
}

export interface CompareFilesResponse {
  success: boolean;
  fileName1: string;
  fileName2: string;
  totalClients: number;
  hasBoth: ComparisonClient[];
  hasFile1Only: ComparisonClient[];
  hasFile2Only: ComparisonClient[];
  hasNeither: ComparisonClient[];
}
