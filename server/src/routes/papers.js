import express from 'express';
import multer from 'multer';
import path from 'path';
import { getPapers, getPaperById, addPaper, deletePaper } from '../utils/db.js';
import { saveBase64File, removeFileByUrl, UPLOADS_DIR, ensureUploadsDir } from '../utils/fileHelper.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Multer storage for direct multipart uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitized = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    cb(null, `paper_${Date.now()}_${sanitized}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

/**
 * GET /api/papers
 * Returns list of all question papers
 */
router.get('/', async (req, res, next) => {
  try {
    const papers = await getPapers();
    res.json(papers);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/papers/:id
 * Returns a specific question paper
 */
router.get('/:id', async (req, res, next) => {
  try {
    const paper = await getPaperById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    res.json(paper);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/papers
 * Creates a new question paper (Protected)
 * Supports Base64 data URL for file uploads or direct URLs
 */
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      department,
      batch,
      subject,
      uploadType,
      fileContent,
      fileName,
      driveLink,
      youtubeLink,
      description,
    } = req.body;

    if (!department || !batch || !subject || !uploadType) {
      return res.status(400).json({ message: 'Department, batch, subject, and uploadType are required.' });
    }

    let fileUrl = '';
    let savedFileName = fileName || '';

    if (uploadType === 'file') {
      if (!fileContent) {
        return res.status(400).json({ message: 'File content is required for file uploads.' });
      }

      // Save base64 file to disk
      fileUrl = await saveBase64File(fileContent, fileName || 'question-paper');
    } else if (uploadType === 'drive') {
      if (!driveLink) {
        return res.status(400).json({ message: 'Google Drive link is required.' });
      }
    } else if (uploadType === 'youtube') {
      if (!youtubeLink) {
        return res.status(400).json({ message: 'YouTube link is required.' });
      }
    } else {
      return res.status(400).json({ message: `Invalid uploadType: ${uploadType}` });
    }

    const paperData = {
      department,
      batch,
      subject,
      uploadType,
      fileUrl: fileUrl || undefined,
      fileName: savedFileName || undefined,
      driveLink: driveLink || undefined,
      youtubeLink: youtubeLink || undefined,
      description: description || undefined,
      uploadedAt: new Date().toISOString(),
    };

    const newPaper = await addPaper(paperData);
    res.status(201).json(newPaper);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/papers/upload-multipart
 * Creates paper via multipart/form-data (Alternative upload method)
 */
router.post('/upload-multipart', authenticateToken, upload.single('file'), async (req, res, next) => {
  try {
    const { department, batch, subject, uploadType, driveLink, youtubeLink, description } = req.body;

    if (!department || !batch || !subject || !uploadType) {
      return res.status(400).json({ message: 'Department, batch, subject, and uploadType are required.' });
    }

    let fileUrl;
    let fileName;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    const paperData = {
      department,
      batch,
      subject,
      uploadType,
      fileUrl,
      fileName,
      driveLink,
      youtubeLink,
      description,
      uploadedAt: new Date().toISOString(),
    };

    const newPaper = await addPaper(paperData);
    res.status(201).json(newPaper);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/papers/:id
 * Deletes a question paper by ID (Protected)
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const paper = await getPaperById(id);

    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }

    // Clean up uploaded file if present
    if (paper.fileUrl) {
      await removeFileByUrl(paper.fileUrl);
    }

    await deletePaper(id);
    res.json({ message: 'Question paper deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
