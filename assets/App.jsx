import React from "react";
import SfReactMap from "./pages/SfReactMap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Equipment from "./pages/Equipment";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Forum from "./pages/Forum";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShowTopic from "./pages/ShowTopic";
import CreateEquipment from "./pages/CreateEquipment";
import CreateArticle from "./pages/CreateArticle";
import CreateTopic from "./pages/CreateTopic";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
