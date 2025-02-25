// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Panel from './components/Panel';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './routes/RedirectIfAuthenticated'



function App() {
  return (
    <Router>
      <Routes>
        
        {/* componente principal */}
        <Route path="/" element={<Home />} />

        {/* componente login */}
        <Route path="/panelLogin" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />

        {/* componente panel de administrador */}
        <Route path="/panel"  element={ <ProtectedRoute><Panel /></ProtectedRoute>}/>

      </Routes>
    </Router>
  );
}

export default App
