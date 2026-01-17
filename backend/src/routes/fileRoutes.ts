import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs-extra';
import path from 'path';
import {
  createReturnsFolders,
  moveReturnFiles,
  deleteReturnFolders,
  searchFiles,
  compareFiles
} from '../services/fileService';

const router = Router();

// Validation middleware
const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

// Get all available drives (Windows)
function getAvailableDrives(): string[] {
  const drives: string[] = [];
  for (let i = 65; i <= 90; i++) {
    const drive = String.fromCharCode(i) + ':\\';
    try {
      if (fs.existsSync(drive)) {
        drives.push(drive);
      }
    } catch {
      // Drive doesn't exist or isn't accessible
    }
  }
  return drives;
}

/**
 * GET /api/drives
 * Returns list of available drives
 */
router.get('/drives', (req: Request, res: Response): void => {
  try {
    const drives = getAvailableDrives();
    res.json({ drives });
  } catch (error) {
    console.error('Drives error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/list-dirs
 * Lists directories in a given path
 */
router.post('/list-dirs', (req: Request, res: Response): void => {
  try {
    const { path: folderPath } = req.body;

    if (!folderPath) {
      res.status(400).json({ error: 'path is required' });
      return;
    }

    if (!fs.existsSync(folderPath)) {
      res.status(404).json({ error: 'Path does not exist' });
      return;
    }

    const items = fs.readdirSync(folderPath, { withFileTypes: true });
    const folders = items
      .filter(item => {
        // Skip hidden folders and system folders
        if (item.name.startsWith('.') || item.name.startsWith('$')) return false;
        if (['node_modules', 'System Volume Information', 'Recovery'].includes(item.name)) return false;
        return item.isDirectory();
      })
      .map(item => ({
        name: item.name,
        path: path.join(folderPath, item.name),
        isDirectory: true
      }));

    res.json({ folders });
  } catch (error) {
    console.error('List dirs error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Folder paths validation
const folderPathsValidation = [
  body('folderPaths')
    .isArray({ min: 1 })
    .withMessage('folderPaths must be a non-empty array'),
  body('folderPaths.*')
    .isString()
    .notEmpty()
    .withMessage('Each folder path must be a non-empty string')
];

/**
 * POST /api/structural/create-returns
 * Creates "Returns" folder inside each selected folder
 */
router.post(
  '/structural/create-returns',
  folderPathsValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { folderPaths } = req.body;
      const result = await createReturnsFolders(folderPaths);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/structural/move-return-files
 * Moves all Return PDF files to the Returns folder
 */
router.post(
  '/structural/move-return-files',
  folderPathsValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { folderPaths } = req.body;
      const result = await moveReturnFiles(folderPaths);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/structural/delete-return-folders
 * Deletes all folders named "Return" inside selected folders
 */
router.post(
  '/structural/delete-return-folders',
  folderPathsValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { folderPaths } = req.body;
      const result = await deleteReturnFolders(folderPaths);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/search/files
 * Searches for files with the given name across all selected folders
 */
router.post(
  '/search/files',
  [
    ...folderPathsValidation,
    body('fileName')
      .isString()
      .notEmpty()
      .withMessage('fileName is required')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { folderPaths, fileName } = req.body;
      const result = await searchFiles(folderPaths, fileName);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/compare/files
 * Compares two files across all selected folders
 */
router.post(
  '/compare/files',
  [
    ...folderPathsValidation,
    body('fileName1')
      .isString()
      .notEmpty()
      .withMessage('fileName1 is required'),
    body('fileName2')
      .isString()
      .notEmpty()
      .withMessage('fileName2 is required')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { folderPaths, fileName1, fileName2 } = req.body;
      const result = await compareFiles(folderPaths, fileName1, fileName2);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
