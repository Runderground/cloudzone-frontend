import { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import "./App.css";
import { Toaster } from 'react-hot-toast'
import { AuthContext } from "./contexto/AuthContext";
import Explore from './pages/authPages/Explore.jsx'
import NavBar from "./components/NavBar.jsx";
import SideBar from "./components/SideBar.jsx";
import Profile from "./pages/authPages/Profile.jsx";
import Post from "./pages/authPages/Post.jsx";

function App() {
  const { user } = useContext(AuthContext)
  return (
    <div className="App">
      {!user ? <NavBar /> : <SideBar/>}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          error: {
            style: {
              background: "#A84344",
              color: "white",
            },
          },
          success: {
            style: {
              background: "#52AF44",
              color: "white",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={!user ? <Home /> : <Explore/>} />
        <Route path="/login" element={!user ? <Login /> : <Explore/>} />
        <Route path="/cadastro" element={!user ? <Cadastro /> : <Explore/>} />
        <Route path="/explore" element={!user ? <Login /> : <Explore/>} />
        <Route path="/post/:postId" element={!user ? <Login /> : <Post/>} />
      </Routes>
    </div>
  );
}

export default App;
