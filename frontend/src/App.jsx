import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { CreatePost } from "./pages/CreatePost";
import { PostDetail } from "./pages/PostDetail";
import { Profile } from "./pages/Profile";

function App() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-16">
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/register"
                        element={<Register />}
                    />
                    <Route
                        path="/create-post"
                        element={<CreatePost />}
                    />
                    <Route
                        path="/post/:id"
                        element={<PostDetail />}
                    />
                    <Route
                        path="/profile/:id"
                        element={<Profile />}
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;
