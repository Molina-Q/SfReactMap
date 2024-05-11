import React from "react";
import SfReactMap from "./pages/SfReactMap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Equipment from "./pages/Equipment";
import Home from "./pages/Home";
import Forum from "./pages/Forum";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShowTopic from "./pages/ShowTopic";
import CreateEquipment from "./pages/CreateEquipment";
import CreateArticle from "./pages/CreateArticle";
import CreateTopic from "./pages/CreateTopic";
import Profile from "./pages/Profile";
import NavbarMap from "./components/NavbarMap";

export default function App() {
  return (
    <BrowserRouter>
    <NavbarMap />
      <Routes>
        <Route path="/map" element={<SfReactMap />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/topic/:topicId" element={<ShowTopic />} />
        <Route path="/equipment/create" element={<CreateEquipment />} />
        <Route path="/article/create" element={<CreateArticle />} />
        <Route path="/topic/create" element={<CreateTopic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};