# Social Media App - Backend

Welcome to the backend API of the Social Media App. This server provides the core business logic, database interactions, and RESTful API endpoints for the social media platform.

## 🚀 Tech Stack

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
-   **Authentication**: JWT (JSON Web Tokens) with RSA 256-bit encryption
-   **Validation**: express-validator

## 🛠️ Prerequisites

Before you begin, ensure you have met the following requirements:

-   **Node.js**: v14.x or higher
-   **npm**: v6.x or higher
-   **MongoDB**: Local installation or connection string to a remote instance

## 🔧 Installation

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the root of the `backend` directory based on the provided `.env.example`.

```bash
cp .env.example .env
```

**Key Variables:**

-   `PORT`: Server port (default: 3000)
-   `DB_HOST`, `DB_PORT`, `DB_NAME`: MongoDB connection details.
-   `ALLOWED_URLS`: Comma-separated list of allowed origins for CORS (e.g., frontend URL).

### 2. JWT Keys

The application uses RSA key pairs for secure JWT signing. You need to generate `jwt.private.key` and `jwt.public.key` in the `keys` directory.

> **Note**: This project setup expects the keys to be present in `backend/keys/`.

## 🏃‍♂️ Running the Server

**Development Mode** (with hot-reload via nodemon):

```bash
npm start
```

## 📂 Project Structure

The project follows a modular, layered architecture:

```
src/
├── config/         # Environment and application configuration
├── controllers/    # Request handlers (logic orchestration)
├── core/           # Core utilities (Response handlers, Error classes)
├── loaders/        # Startup processes (DB connection, etc.)
├── middlewares/    # Express middlewares (Auth, Error handling, Logging)
├── models/         # Mongoose schemas and models
├── routers/        # API route definitions
├── services/       # Business logic layer
├── utils/          # Helper functions
└── server.js       # Entry point
```

## 🔐 Authentication Flow

1.  **Register/Login**: Returns an `accessToken` and sets a `refreshToken` cookie.
2.  **Access**: Send `Authorization: Bearer <accessToken>` in headers for protected routes.
3.  **Refresh**: Use the refresh endpoint to get a new access token when the current one expires.
