import React from 'react';
import Navbar from './Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Documentation from './pages/Documentation';
import { Route, Routes } from 'react-router-dom';
import './styles.css'; // Adjust the path based on your folder structure

function App() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/documentation" element={<Documentation />} /> {/* Add this */}
                </Routes>
            </div>
        </>
    );
}

export default App;
