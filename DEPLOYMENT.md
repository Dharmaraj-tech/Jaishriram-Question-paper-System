# Jaishriram College Question Paper Management System - Deployment Guide

This repository contains a full-stack web application with a **React + Vite** frontend and a **Node.js + Express** REST API backend.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Run in Development Mode
Run both frontend and backend concurrently with a single command:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

### 🔑 Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

---

## 🛠️ API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System status check |
| `POST` | `/api/auth/login` | Public | Admin login (returns JWT token) |
| `GET` | `/api/auth/me` | Admin | Get current admin user info |
| `GET` | `/api/papers` | Public | Get list of all question papers |
| `POST` | `/api/papers` | Admin | Create new question paper (file, drive, youtube) |
| `DELETE` | `/api/papers/:id` | Admin | Delete paper & associated files |
| `GET` | `/uploads/:file` | Public | Serve uploaded PDF / image files |

---

## 🌐 Production Deployment Options

### Option 1: Render.com (Recommended - Blueprint Setup)

1. Push your repository to **GitHub** or **GitLab**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Blueprint**.
3. Connect your repository. Render will automatically detect `render.yaml`.
4. Click **Apply**. Render will build and deploy the application.

*Alternatively, manually create a Web Service on Render:*
- **Build Command**: `npm run build:all`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `JWT_SECRET`: `<generate-a-strong-secret>`
  - `ADMIN_USERNAME`: `admin`
  - `ADMIN_PASSWORD`: `<your-secure-admin-password>`

---

### Option 2: Docker Container (AWS, DigitalOcean, Railway, Fly.io)

Build and run using the included multi-stage `Dockerfile`:

```bash
# Build Docker image
docker build -t jaishriram-qpaper-system .

# Run container
docker run -d -p 5000:5000 \
  -e NODE_ENV=production \
  -e JWT_SECRET="your-production-secret-key" \
  -e ADMIN_USERNAME="admin" \
  -e ADMIN_PASSWORD="your-strong-password" \
  --name qpaper-app \
  jaishriram-qpaper-system
```

---

### Option 3: Separate Frontend & Backend Deployment

#### Backend (Render / Railway / VPS):
- Set root directory to `server`
- Build command: `npm install`
- Start command: `node src/index.js`
- Set `CORS_ORIGIN` to your frontend URL.

#### Frontend (Vercel / Netlify):
- Build command: `npm run build`
- Output directory: `dist`
- Set Environment Variable:
  - `VITE_API_URL`: `https://your-backend-api-url.onrender.com`

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port for Express server |
| `NODE_ENV` | `development` | Environment mode (`development` or `production`) |
| `JWT_SECRET` | `jaishriram-qpaper-secret-key-2026` | Secret key for JWT token signing |
| `JWT_EXPIRES_IN` | `7d` | Expiration time for JWT tokens |
| `ADMIN_USERNAME` | `admin` | Initial admin username |
| `ADMIN_EMAIL` | `admin@jaishriram.edu.in` | Initial admin email |
| `ADMIN_PASSWORD` | `admin123` | Initial admin password |
| `CORS_ORIGIN` | `*` | Allowed origin header for CORS |
| `MAX_FILE_SIZE_MB` | `25` | Maximum upload size limit in MB |
