// import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";


function App() {
  return (
    <Router>
      <Routes>
        
        {/* componente principal */}
        <Route path="/" element={<Home />} />

        {/* componente login */}
        <Route path="/panelLogin" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App
