import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
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
