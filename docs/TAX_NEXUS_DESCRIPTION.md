# Tax Nexus

**Client Folder & Tax Returns Management System**

Developed for **Tehsin Law Associates**

---

## Overview

Tax Nexus is a modern web application designed to help law firms and tax professionals manage client folders and tax return files efficiently. It provides a clean, user-friendly interface with powerful features to organize, search, and compare tax return documents across multiple client folders.

---

## Key Features

### 1. Structural Optimization

Organize your client folders in three easy steps:

#### Step 1: Create Returns Folders
- Automatically creates a "Returns" folder inside each selected client folder
- Skips folders that already have a Returns folder
- Keeps your file structure consistent across all clients

#### Step 2: Move Return Files
- Finds all PDF files with "Return" in the filename
- Moves them automatically to the Returns folder
- Saves time organizing files manually

#### Step 3: Delete Return Folders
- Removes old "Return" folders (not "Returns")
- Helps clean up outdated folder structures
- Includes confirmation to prevent accidental deletion

### 2. File Search

Quickly find which clients have specific tax return files:

- Search for any file by name (e.g., "Return 2024")
- Searches inside the Returns folder of each client
- Shows a clear summary of:
  - How many clients have the file
  - How many clients are missing the file
  - Complete list of clients in each category

### 3. Return Comparison

Compare two tax return files across all your clients:

- Enter two file names to compare (e.g., "Return 2024" vs "Return 2025")
- Select client folders to check
- See results in four clear categories:
  - **Have Both Files** - Clients with both returns filed
  - **Only First File** - Clients with only the first return
  - **Only Second File** - Clients with only the second return
  - **Missing Both** - Clients missing both returns

### 4. Smart Folder Selection

- **Select Individual Folders** - Pick specific client folders one by one
- **Select All Subfolders** - Choose a parent folder and automatically add all client folders inside it
- **Clear All** - Remove all selected folders with one click
- Visual display showing selected folders with full paths

---

## Technology

Tax Nexus is built with modern, reliable technologies:

### Frontend (What You See)
- **React** - A popular framework for building user interfaces
- **TypeScript** - Adds safety and reliability to the code
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Clean, professional styling
- **Lucide Icons** - Beautiful, consistent icons

### Backend (Server)
- **Node.js** - JavaScript runtime for the server
- **Express** - Web framework for handling requests
- **TypeScript** - Type-safe server code
- **fs-extra** - Enhanced file system operations

### Design
- **Maroon/Dark Red Theme** - Professional color scheme
- **Animated Gradient Title** - Eye-catching header
- **Responsive Layout** - Works on different screen sizes
- **Toast Notifications** - Clear feedback for actions

---

## How It Works

1. **Start the Backend Server** - Runs on port 3001
2. **Start the Frontend** - Runs on port 5173
3. **Open in Browser** - Access at http://localhost:5173
4. **Select Client Folders** - Use the folder browser to pick folders
5. **Run Operations** - Create folders, move files, search, or compare

---

## Requirements

- **Node.js** version 18 or higher
- **npm** package manager
- A modern web browser (Chrome, Firefox, Edge, Safari)

---

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   cd backend && npm install
   cd frontend && npm install
   ```
3. Start the backend:
   ```
   cd backend && npm run dev
   ```
4. Start the frontend:
   ```
   cd frontend && npm run dev
   ```
5. Open http://localhost:5173 in your browser

---

## Use Cases

- **Year-End Organization** - Create Returns folders for all clients at once
- **Filing Status Check** - Find clients missing specific tax returns
- **Compliance Tracking** - Compare returns across years to find gaps
- **Bulk File Management** - Move all return files to proper locations

---

## Security

- Runs locally on your computer
- No data is sent to external servers
- Full control over your client files

---

## Support

For questions or assistance, contact Tehsin Law Associates.

---

*Tax Nexus - Making tax return management simple and efficient.*
