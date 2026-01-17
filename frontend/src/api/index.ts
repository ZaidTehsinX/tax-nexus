import axios from 'axios';
import {
  CreateReturnsFoldersResponse,
  MoveReturnFilesResponse,
  DeleteReturnFoldersResponse,
  SearchFilesResponse,
  CompareFilesResponse
} from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await api.get('/health');
    return response.data.success;
  } catch {
    return false;
  }
}

// Structural Optimization APIs

export async function createReturnsFolders(folderPaths: string[]): Promise<CreateReturnsFoldersResponse> {
  const response = await api.post('/structural/create-returns', { folderPaths });
  return response.data;
}

export async function moveReturnFiles(folderPaths: string[]): Promise<MoveReturnFilesResponse> {
  const response = await api.post('/structural/move-return-files', { folderPaths });
  return response.data;
}

export async function deleteReturnFolders(folderPaths: string[]): Promise<DeleteReturnFoldersResponse> {
  const response = await api.post('/structural/delete-return-folders', { folderPaths });
  return response.data;
}

// Search API

export async function searchFiles(folderPaths: string[], fileName: string): Promise<SearchFilesResponse> {
  const response = await api.post('/search/files', { folderPaths, fileName });
  return response.data;
}

// Compare API

export async function compareFiles(
  folderPaths: string[],
  fileName1: string,
  fileName2: string
): Promise<CompareFilesResponse> {
  const response = await api.post('/compare/files', { folderPaths, fileName1, fileName2 });
  return response.data;
}

export default api;
