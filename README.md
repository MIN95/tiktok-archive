# TikTok API Integration Project

A web application to integrate with TikTok API v2 using React (Frontend) and Node.js (Backend).

## 📁 Project Structure
- `frontend/`: React application (Vite) hosted on GitHub Pages
- `backend/`: Node.js Express application hosted on a public server (Vercel/Render/Railway)

## 🚀 Setup Instructions

### 1. Backend Setup
1. Navigate to `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file (optional, defaults to 3000):
   ```
   PORT=3000
   ```
3. Deploy this folder to a public server (e.g., Render, Railway, Vercel)
4. Note the public URL (e.g., `https://my-tiktok-backend.onrender.com`)

### 2. Frontend Setup
1. Navigate to `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Configure environment:
   - Create `.env` in `frontend/`:
     ```
     VITE_BACKEND_URL=https://your-deployed-backend-url.com
     ```
3. Update `homepage` in `package.json` to your GitHub Pages URL:
   ```json
   "homepage": "https://<your-github-username>.github.io/<repo-name>/"
   ```
4. Build and Deploy to GitHub Pages:
   ```bash
   npm run build
   # Use gh-pages or manual upload of 'dist' folder
   ```

## 🔧 TikTok App Configuration
1. Go to TikTok Developer Portal
2. Set **Redirect URI** to match your GitHub Pages link:
   `https://<username>.github.io/<repo>/callback`
3. Copy **Client Key** and **Client Secret**

## 📄 Verification Files
The following static files are in `frontend/public/` for TikTok verification:
- `terms.html` → `https://<domain>/terms.html`
- `privacy.html` → `https://<domain>/privacy.html`
- `tiktok-domain-verification.html` → `https://<domain>/tiktok-domain-verification.html`

Replace `YOUR_VERIFICATION_CODE_HERE` in `tiktok-domain-verification.html` with your actual verification code from TikTok.

## ✨ Features
- Input App Key/Secret dynamically
- OAuth 2.0 Flow
- Fetch User Info and Video List
- Secure Token Exchange (Backend)

## 🔐 Security
- App Key and Secret are NOT stored anywhere
- Handled per-request only via sessionStorage
- HTTPS required for all requests
