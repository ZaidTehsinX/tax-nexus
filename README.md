# Tax Nexus

**Client Folder & Tax Returns Management Application**

Created for **Tehsin Law Associates** by Zaid Tehsin

---

## 🏛️ Overview

Tax Nexus is a desktop application designed to streamline the management of client folders and tax returns for tax law firms. It provides powerful tools for organizing, searching, and comparing tax return files across multiple client directories.

## ✨ Features

### Section 1: Structural Optimization
- **Step 1 - Create Returns Folder**: Creates a "Returns" folder inside each selected client folder (skips if already exists)
- **Step 2 - Move Return Files**: Finds all PDF files with "Return" in the name and moves them to the Returns folder
- **Step 3 - Delete Return Folders**: Permanently removes all folders named "Return" (not "Returns") from selected directories

### Section 2: File Search
- Search for specific files across multiple client folders
- Deep search through all subfolders
- Results displayed in user-friendly cards showing which clients have/don't have the file

### Section 3: Return Comparison
- Compare two different return files (e.g., Return 2024 vs Return 2025)
- See which clients have both, only one, or neither file
- Visual categorization with color-coded results

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Styling**: Tailwind CSS
- **Desktop**: Electron
- **File Operations**: fs-extra

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   cd "Tax Nexus"
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   
   Or install individually:
   ```bash
   # Root dependencies (Electron)
   npm install
   
   # Backend dependencies
   cd backend && npm install
   
   # Frontend dependencies
   cd ../frontend && npm install
   ```

## 🚀 Running the Application

### Development Mode (Browser)

Run backend and frontend separately:

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

Or run both together from root:
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Desktop Mode (Electron)

```bash
npm run start
```

This will start the backend server and launch the Electron desktop app.

## 📁 Project Structure

```
Tax Nexus/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # File operation logic
│   │   ├── middleware/     # Error handling
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Path utilities
│   │   └── server.ts       # Main server entry
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── api/           # API service layer
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── tailwind.config.js
│   └── package.json
│
├── electron/               # Electron main process
│   ├── main.js
│   └── preload.js
│
└── package.json           # Root package.json
```

## 🔌 API Endpoints

### Structural Optimization
- `POST /api/structural/create-returns` - Create Returns folders
- `POST /api/structural/move-return-files` - Move Return PDFs
- `POST /api/structural/delete-return-folders` - Delete Return folders

### Search
- `POST /api/search/files` - Search for files across folders

### Compare
- `POST /api/compare/files` - Compare two files across folders

### Health Check
- `GET /api/health` - Check server status

## 🎨 Theme

The application uses a professional maroon/dark red color scheme:
- Primary: Maroon (#800020)
- Accent: Dark Red (#8B0000)
- Background: Light Gray (#f0f0f2)

The "Nexus" text features an animated gradient that cycles through maroon → red → black.

## ⚠️ Important Notes

1. **File Operations**: All file operations (move, delete) are irreversible. Always backup important files before using these features.

2. **Folder Selection**: When running in browser mode, folder selection is limited. Use the Electron desktop app for full file system access.

3. **PDF Matching**: The application searches for PDF files containing "Return" in the filename (case-insensitive).

## 📄 License

MIT License - Created for Tehsin Law Associates

---

**Created by Zaid Tehsin** © 2026
