import React from "react";
import SfReactMap from "./pages/SfReactMap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Equipment from "./pages/Equipment";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/map" element={<SfReactMap />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/create" element={<Equipment />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
