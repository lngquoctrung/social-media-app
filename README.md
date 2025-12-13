# Social Media App

A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js). This project features a responsive UI, secure authentication, and real-time-like interactions.

## 🏗️ Architecture

The project is divided into two main components:

-   **[Frontend](./frontend/README.md)**: A Single Page Application (SPA) built with React 19, Vite, and Tailwind CSS.
-   **[Backend](./backend/README.md)**: A RESTful API built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites

-   **Node.js**: v14.x or higher
-   **npm**: v6.x or higher
-   **MongoDB**: v4.x or higher (or Docker)
-   **Docker** (Optional, for containerized setup)

### 🐳 Docker Setup (Recommended)

The easiest way to run the entire application (Frontend + Backend + Database) is using Docker Compose.

1.  **Configure Environment**:
    Ensure you have created the `.env` files in both `frontend` and `backend` directories.

    ```bash
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    ```

2.  **Generate Keys**:
    Ensure you have generated the RSA keys for the backend at `backend/keys/`.

3.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    -   Frontend: `http://localhost:5173` (or port defined in compose)
    -   Backend: `http://localhost:3000`
    -   MongoDB: `localhost:27017`

### 🛠️ Manual Setup

If you prefer to run services individually:

#### 1. Backend Setup

Follow the detailed instructions in [backend/README.md](./backend/README.md).

```bash
cd backend
npm install
npm start
```

#### 2. Frontend Setup

Follow the detailed instructions in [frontend/README.md](./frontend/README.md).

```bash
cd frontend
npm install
npm run dev
```

## 📄 License

[ISC](https://opensource.org/licenses/ISC)
