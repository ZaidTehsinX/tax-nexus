import path from 'path';

/**
 * Sanitizes a file path to prevent directory traversal attacks
 */
export function sanitizePath(inputPath: string): string {
  // Normalize the path (resolves .. and . segments)
  const normalized = path.normalize(inputPath);
  
  // Remove any null bytes
  const cleaned = normalized.replace(/\0/g, '');
  
  return cleaned;
}

/**
 * Validates that a path exists and is accessible
 */
export function isValidPath(inputPath: string): boolean {
  try {
    const sanitized = sanitizePath(inputPath);
    // Check if path is absolute
    return path.isAbsolute(sanitized);
  } catch {
    return false;
  }
}

/**
 * Gets the folder name from a path
 */
export function getFolderName(folderPath: string): string {
  return path.basename(folderPath);
}

/**
 * Joins paths safely
 */
export function joinPaths(...paths: string[]): string {
  return path.join(...paths);
}
