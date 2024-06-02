import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './Login/Signup Components/LoginSignup';
import HomePage from './Login/HomePage Components/HomePage';
import ForgotPassword from './Login/Signup Components/ForgotPassword';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    };

    async function isAuth() {
        try {
            const response = await fetch("http://localhost:5000/auth/is-verify", {
                method: "GET", 
                headers: { token: localStorage.token }
            }); 

            const parseRes = await response.json();
            parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false); 
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        isAuth(); 
    }, []); 

    return (
        <Fragment>
            <Router>
                <Routes>
                    <Route path="/login-signup" element={!isAuthenticated ? (<LoginSignup setAuth={setAuth} />) : (<Navigate to="/homepage" />)} />
                    <Route path="/homepage" element={isAuthenticated ? (<HomePage setAuth={setAuth} />) : (<Navigate to="/login-signup" />)} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="*" element={<LoginSignup setAuth={setAuth} />} /> {/* Default route */}
                </Routes>
            </Router>
        </Fragment>
    );
};

export default App;
