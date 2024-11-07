import React from 'react';
import Navbar from './Navbar';
import Home from './pages/Home';
import About from './pages/About';
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
                </Routes>
            </div>
        </>
    );
}

export default App;
