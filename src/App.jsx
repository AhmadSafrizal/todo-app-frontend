import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import "tailwindcss/tailwind.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
