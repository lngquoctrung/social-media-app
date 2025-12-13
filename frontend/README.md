# Social Media App - Frontend

Welcome to the frontend of the Social Media App. This is a modern single-page application (SPA) built with React 19, Vite, and Tailwind CSS 4, offering a responsive and interactive user experience.

## 🚀 Tech Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `clsx` and `tailwind-merge`
-   **Routing**: [React Router](https://reactrouter.com/) (v7)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

## 🛠️ Prerequisites

-   **Node.js**: v14.x or higher
-   **npm**: v6.x or higher

## 🔧 Installation

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## ⚙️ Configuration

1.  Create a `.env` file in the root of the `frontend` directory based on `.env.example`.

    ```bash
    cp .env.example .env
    ```

2.  Update the configuration if your backend runs on a different URL:
    -   `VITE_API_URL`: URL of the backend API (default: `http://localhost:3000`).

## 🏃‍♂️ Running the App

### Development Mode

To start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

To create a production-ready build:

```bash
npm run build
```

The build artifacts will be generated in the `dist` directory.

### Preview Production Build

To locally preview the production build:

```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── api/            # API endpoints and Axios instance configuration
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components
│   ├── common/     # Generic components (Modal, Button, etc.)
│   ├── layout/     # Layout components (Navbar, Sidebar)
│   ├── post/       # Post-specific components (PostCard)
│   └── ui/         # Design system primitives (Toast)
├── context/        # React Context providers (Auth, Toast)
├── pages/          # Application pages/views (Home, Login, Profile, etc.)
├── App.jsx         # Main application component & routing
└── main.jsx        # Application entry point
```

## 🎨 Features

-   **Responsive Design**: Mobile-first approach using Tailwind CSS.
-   **Authentication**: Login, Register to access protected features.
-   **Feed**: Infinite scroll-like feed of posts.
-   **Interactions**: Like, Comment, and Share posts.
-   **Toast Notifications**: Custom toast system for user feedback.
