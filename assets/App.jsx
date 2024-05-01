import React from "react";
import SfReactMap from "./pages/SfReactMap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Equipment from "./pages/Equipment";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Forum from "./pages/Forum";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/map" element={<SfReactMap />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/equipment/create" element={<Equipment />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
