import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

/**
 * Saves a base64 Data URL to the uploads directory.
 * @param {string} base64Data - e.g. "data:application/pdf;base64,..." or raw base64
 * @param {string} originalFileName - Original filename from client
 * @returns {Promise<string>} Relative URL path to access file (e.g., "/uploads/file.pdf")
 */
export async function saveBase64File(base64Data, originalFileName = 'file') {
  await ensureUploadsDir();

  let mimeType = '';
  let base64String = base64Data;

  // If payload contains data URL header
  if (base64Data.includes(';base64,')) {
    const parts = base64Data.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    base64String = parts[1];
  }

  // Derive file extension
  let ext = path.extname(originalFileName) || '';
  if (!ext) {
    if (mimeType.includes('pdf')) ext = '.pdf';
    else if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
    else if (mimeType.includes('word') || mimeType.includes('docx')) ext = '.docx';
    else if (mimeType.includes('doc')) ext = '.doc';
    else ext = '.bin';
  }

  const sanitizedBaseName = path.basename(originalFileName, path.extname(originalFileName))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 50);

  const filename = `paper_${Date.now()}_${sanitizedBaseName}${ext}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  const buffer = Buffer.from(base64String, 'base64');
  await fs.writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}

/**
 * Deletes a file from the uploads directory given its relative URL.
 * @param {string} fileUrl - e.g. "/uploads/filename.pdf"
 */
export async function removeFileByUrl(fileUrl) {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  
  const filename = path.basename(fileUrl);
  const filePath = path.join(UPLOADS_DIR, filename);

  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`[FileHelper] Error deleting file ${filePath}:`, err.message);
    }
  }
}
