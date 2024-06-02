import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Login/Signup Components/LoginSignup';
import HomePage from './Login/HomePage Components/HomePage';
import ForgotPassword from './Login/Signup Components/ForgotPassword';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login-signup" element={<LoginSignup />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<LoginSignup />} /> {/* Default route */}
            </Routes>
        </Router>
    );
};

export default App;
