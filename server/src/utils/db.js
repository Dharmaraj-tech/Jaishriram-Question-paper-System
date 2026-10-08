import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultData = {
  users: [],
  papers: [],
};

// In-memory cache for fast sync reads & writes
let cache = null;

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function readDb() {
  if (cache) return cache;
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    cache = JSON.parse(raw);
  } catch {
    cache = { ...defaultData };
    await writeDb(cache);
  }
  return cache;
}

async function writeDb(data) {
  await ensureDataDir();
  cache = data;
  const tempFile = `${DB_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempFile, DB_FILE);
}

export async function initDb() {
  const db = await readDb();
  
  // Initialize default admin user if none exists
  let admin = db.users.find(u => u.role === 'admin' || u.username === config.adminUsername);
  
  const hashedPassword = await bcrypt.hash(config.adminPassword, 10);

  if (!admin) {
    admin = {
      id: 'admin-1',
      username: config.adminUsername,
      email: config.adminEmail,
      passwordHash: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    db.users.push(admin);
    await writeDb(db);
    console.log(`[DB] Default admin initialized with username: "${config.adminUsername}"`);
  } else {
    // Optionally update admin credentials from env if changed
    admin.username = config.adminUsername;
    admin.email = config.adminEmail;
    admin.passwordHash = hashedPassword;
    await writeDb(db);
  }

  // Pre-seed mock papers if DB is empty
  if (db.papers.length === 0) {
    db.papers = [
      {
        id: 'sample-paper-1',
        department: 'Computer Science',
        batch: '2023-2024',
        subject: 'Data Structures and Algorithms',
        uploadType: 'file',
        fileUrl: '',
        fileName: 'DSA_EndSem_2023.pdf',
        description: 'Question Paper for End Semester Examination 2023',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'sample-paper-2',
        department: 'Information Technology',
        batch: '2022-2023',
        subject: 'Database Management Systems',
        uploadType: 'drive',
        driveLink: 'https://drive.google.com/file/d/1234567890/view',
        description: 'DBMS Nov/Dec 2022 Question Paper',
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    await writeDb(db);
  }

  return db;
}

export async function findUserByUsernameOrEmail(identifier) {
  const db = await readDb();
  const lower = (identifier || '').toLowerCase();
  return db.users.find(
    u => u.username.toLowerCase() === lower || u.email.toLowerCase() === lower
  );
}

export async function getPapers() {
  const db = await readDb();
  // Return papers sorted by uploadedAt descending
  return [...db.papers].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

export async function getPaperById(id) {
  const db = await readDb();
  return db.papers.find(p => p.id === id);
}

export async function addPaper(paperData) {
  const db = await readDb();
  const newPaper = {
    id: `paper-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...paperData,
    uploadedAt: paperData.uploadedAt || new Date().toISOString(),
  };
  db.papers.push(newPaper);
  await writeDb(db);
  return newPaper;
}

export async function deletePaper(id) {
  const db = await readDb();
  const index = db.papers.findIndex(p => p.id === id);
  if (index === -1) return false;
  const deleted = db.papers.splice(index, 1)[0];
  await writeDb(db);
  return deleted;
}
