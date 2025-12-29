# JournalApp

A full-stack Journaling Application built with **Spring Boot** (Backend) and **React + Vite** (Frontend).

## Features
- **User Authentication**: Secure Signup and Login (JWT-based).
- **Journal Entries**: Create, Read, Update, and Delete journal entries.
- **Sentiment Analysis**:
    - **AI-Powered**: Automatically analyzes sentiment from text content.
    - **Manual Override**: Users can optionally select their own sentiment (Happy, Sad, Angry, Anxious).
- **Responsive UI**: Modern interface with verified connectivity.

## Prerequisites
- **Java JDK**: Version 8 or higher (JDK 17 recommended).
- **Node.js**: Version 16 or higher.
- **MongoDB**: Local installation or Atlas Connection string.

## Project Structure
```
JournalApp_Final/
├── Backend/           # Java Spring Boot Application
├── Frontend/          # React + Vite Application
└── README.md          # This file
```

## How to Run Locally

### 1. Backend Setup
1.  Navigate to the Backend directory:
    ```bash
    cd Backend
    ```
2.  Ensure your MongoDB is running or configured in `src/main/resources/application.yml`.
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    *The server will start on `http://localhost:8080`.*

### 2. Frontend Setup
1.  Open a new terminal and navigate to the Frontend directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The frontend will rely on `vite.config.ts` to proxy API requests to the backend.*
    *Access the app at `http://localhost:5173`.*

## Verification Steps
1.  **Signup/Login**: Register a new user and log in. You should be redirected to the Dashboard.
2.  **Create Entry**: Click "New Entry".
    - Type a title and content.
    - (Optional) Select a Sentiment.
    - Click "Create".
3.  **Verify Data**: The entry should appear on the dashboard with the correct sentiment tag.

## Deployment to GitHub

1.  **Initialize Git** (if not done):
    ```bash
    git init
    ```
2.  **Create a .gitignore**:
    Ensure you ignore build artifacts and secrets. Create a `.gitignore` in the root if one doesn't exist, or rely on the ones in `Backend/` and `Frontend/`.
    *Recommended Root `.gitignore` content:*
    ```
    node_modules/
    target/
    .env
    .idea/
    .vscode/
    *.class
    ```
3.  **Stage and Commit**:
    ```bash
    git add .
    git commit -m "Initial commit of JournalApp"
    ```
4.  **Push to Repository**:
    *Create a new repository on GitHub (do not add README/license yet).*
    ```bash
    git branch -M main
    git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
    git push -u origin main
    ```
