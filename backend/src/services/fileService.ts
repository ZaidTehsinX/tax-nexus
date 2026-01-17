import fs from 'fs-extra';
import path from 'path';
import {
  CreateReturnsFoldersResponse,
  MoveReturnFilesResponse,
  DeleteReturnFoldersResponse,
  SearchFilesResponse,
  CompareFilesResponse,
  ClientFileResult,
  ComparisonClient
} from '../types';
import { getFolderName, joinPaths, sanitizePath } from '../utils/pathUtils';

/**
 * Creates a "Returns" folder inside each selected folder if it doesn't exist
 */
export async function createReturnsFolders(folderPaths: string[]): Promise<CreateReturnsFoldersResponse> {
  const results = [];

  for (const folderPath of folderPaths) {
    const sanitizedPath = sanitizePath(folderPath);
    const returnsFolderPath = joinPaths(sanitizedPath, 'Returns');

    try {
      const exists = await fs.pathExists(returnsFolderPath);
      
      if (exists) {
        results.push({
          folderPath: sanitizedPath,
          created: false,
          alreadyExists: true
        });
      } else {
        await fs.ensureDir(returnsFolderPath);
        results.push({
          folderPath: sanitizedPath,
          created: true,
          alreadyExists: false
        });
      }
    } catch (error) {
      results.push({
        folderPath: sanitizedPath,
        created: false,
        alreadyExists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return {
    success: results.every(r => !r.error),
    results
  };
}

/**
 * Recursively finds all PDF files with "Return" in the name
 */
async function findReturnPdfFiles(dirPath: string, excludePath?: string): Promise<string[]> {
  const returnFiles: string[] = [];

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = joinPaths(dirPath, item.name);

      // Skip the Returns folder itself to avoid moving files from it
      if (excludePath && fullPath.toLowerCase() === excludePath.toLowerCase()) {
        continue;
      }

      if (item.isDirectory()) {
        const subFiles = await findReturnPdfFiles(fullPath, excludePath);
        returnFiles.push(...subFiles);
      } else if (item.isFile()) {
        // Check if it's a PDF file with "Return" in the name
        const ext = path.extname(item.name).toLowerCase();
        const nameWithoutExt = path.basename(item.name, ext);
        
        if (ext === '.pdf' && nameWithoutExt.toLowerCase().includes('return')) {
          returnFiles.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return returnFiles;
}

/**
 * Moves all Return PDF files to the Returns folder
 */
export async function moveReturnFiles(folderPaths: string[]): Promise<MoveReturnFilesResponse> {
  const results = [];
  let totalFilesMoved = 0;

  for (const folderPath of folderPaths) {
    const sanitizedPath = sanitizePath(folderPath);
    const returnsFolderPath = joinPaths(sanitizedPath, 'Returns');

    try {
      // Ensure Returns folder exists
      await fs.ensureDir(returnsFolderPath);

      // Find all Return PDF files
      const returnFiles = await findReturnPdfFiles(sanitizedPath, returnsFolderPath);
      const movedFiles: string[] = [];

      for (const filePath of returnFiles) {
        const fileName = path.basename(filePath);
        const destPath = joinPaths(returnsFolderPath, fileName);

        try {
          // Handle duplicate file names
          let finalDestPath = destPath;
          let counter = 1;
          while (await fs.pathExists(finalDestPath)) {
            const ext = path.extname(fileName);
            const nameWithoutExt = path.basename(fileName, ext);
            finalDestPath = joinPaths(returnsFolderPath, `${nameWithoutExt} (${counter})${ext}`);
            counter++;
          }

          await fs.move(filePath, finalDestPath);
          movedFiles.push(path.basename(finalDestPath));
        } catch (moveError) {
          console.error(`Error moving file ${filePath}:`, moveError);
        }
      }

      totalFilesMoved += movedFiles.length;
      results.push({
        folderPath: sanitizedPath,
        filesMoved: movedFiles.length,
        files: movedFiles
      });
    } catch (error) {
      results.push({
        folderPath: sanitizedPath,
        filesMoved: 0,
        files: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return {
    success: results.every(r => !r.error),
    results,
    totalFilesMoved
  };
}

/**
 * Recursively finds and deletes all folders named "Return" (but not "Returns")
 */
async function findAndDeleteReturnFolders(dirPath: string): Promise<string[]> {
  const deletedFolders: string[] = [];

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = joinPaths(dirPath, item.name);

      if (item.isDirectory()) {
        // Check if folder name is exactly "Return" (case-insensitive)
        if (item.name.toLowerCase() === 'return') {
          await fs.remove(fullPath);
          deletedFolders.push(fullPath);
        } else {
          // Recursively search in subdirectories
          const subDeleted = await findAndDeleteReturnFolders(fullPath);
          deletedFolders.push(...subDeleted);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }

  return deletedFolders;
}

/**
 * Deletes all folders named "Return" inside selected folders
 */
export async function deleteReturnFolders(folderPaths: string[]): Promise<DeleteReturnFoldersResponse> {
  const results = [];
  let totalFoldersDeleted = 0;

  for (const folderPath of folderPaths) {
    const sanitizedPath = sanitizePath(folderPath);

    try {
      const deletedFolders = await findAndDeleteReturnFolders(sanitizedPath);
      totalFoldersDeleted += deletedFolders.length;

      results.push({
        folderPath: sanitizedPath,
        foldersDeleted: deletedFolders.length,
        deletedFolders
      });
    } catch (error) {
      results.push({
        folderPath: sanitizedPath,
        foldersDeleted: 0,
        deletedFolders: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return {
    success: results.every(r => !r.error),
    results,
    totalFoldersDeleted
  };
}

/**
 * Recursively searches for a file in a directory and its subdirectories
 */
async function findFileInFolder(dirPath: string, fileName: string): Promise<string | null> {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = joinPaths(dirPath, item.name);

      if (item.isDirectory()) {
        const found = await findFileInFolder(fullPath, fileName);
        if (found) return found;
      } else if (item.isFile()) {
        // Check if file name contains the search term (case-insensitive)
        const nameWithoutExt = path.basename(item.name, path.extname(item.name));
        if (nameWithoutExt.toLowerCase().includes(fileName.toLowerCase())) {
          return fullPath;
        }
      }
    }
  } catch (error) {
    console.error(`Error searching in ${dirPath}:`, error);
  }

  return null;
}

/**
 * Searches for files with the given name across all selected folders
 */
export async function searchFiles(folderPaths: string[], fileName: string): Promise<SearchFilesResponse> {
  const clientsWithFile: ClientFileResult[] = [];
  const clientsWithoutFile: ClientFileResult[] = [];

  for (const folderPath of folderPaths) {
    const sanitizedPath = sanitizePath(folderPath);
    const clientName = getFolderName(sanitizedPath);

    const foundFile = await findFileInFolder(sanitizedPath, fileName);

    if (foundFile) {
      clientsWithFile.push({
        clientName,
        clientPath: sanitizedPath,
        hasFile: true,
        filePath: foundFile
      });
    } else {
      clientsWithoutFile.push({
        clientName,
        clientPath: sanitizedPath,
        hasFile: false
      });
    }
  }

  return {
    success: true,
    fileName,
    totalClients: folderPaths.length,
    clientsWithFile,
    clientsWithoutFile
  };
}

/**
 * Searches for a file specifically in the Returns subfolder
 */
async function findFileInReturnsFolder(clientPath: string, fileName: string): Promise<string | null> {
  const returnsFolderPath = joinPaths(clientPath, 'Returns');

  try {
    const exists = await fs.pathExists(returnsFolderPath);
    if (!exists) return null;

    const items = await fs.readdir(returnsFolderPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        const nameWithoutExt = path.basename(item.name, path.extname(item.name));
        if (nameWithoutExt.toLowerCase().includes(fileName.toLowerCase())) {
          return joinPaths(returnsFolderPath, item.name);
        }
      }
    }
  } catch (error) {
    console.error(`Error searching Returns folder in ${clientPath}:`, error);
  }

  return null;
}

/**
 * Compares two files across all selected folders
 */
export async function compareFiles(
  folderPaths: string[],
  fileName1: string,
  fileName2: string
): Promise<CompareFilesResponse> {
  const hasBoth: ComparisonClient[] = [];
  const hasFile1Only: ComparisonClient[] = [];
  const hasFile2Only: ComparisonClient[] = [];
  const hasNeither: ComparisonClient[] = [];

  for (const folderPath of folderPaths) {
    const sanitizedPath = sanitizePath(folderPath);
    const clientName = getFolderName(sanitizedPath);

    const file1Path = await findFileInReturnsFolder(sanitizedPath, fileName1);
    const file2Path = await findFileInReturnsFolder(sanitizedPath, fileName2);

    const client: ComparisonClient = {
      clientName,
      clientPath: sanitizedPath,
      hasFile1: !!file1Path,
      hasFile2: !!file2Path,
      file1Path: file1Path || undefined,
      file2Path: file2Path || undefined
    };

    if (file1Path && file2Path) {
      hasBoth.push(client);
    } else if (file1Path && !file2Path) {
      hasFile1Only.push(client);
    } else if (!file1Path && file2Path) {
      hasFile2Only.push(client);
    } else {
      hasNeither.push(client);
    }
  }

  return {
    success: true,
    fileName1,
    fileName2,
    totalClients: folderPaths.length,
    hasBoth,
    hasFile1Only,
    hasFile2Only,
    hasNeither
  };
}
