import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginSignupConnected from './Login/Signup Components/LoginSignupConnected';
import HomePage from './Login/HomePage Components/HomePage';
import ForgotPassword from './Login/Signup Components/ForgotPassword';
import RestaurantPage from './FoodReview/RestaurantPage';
import { RestaurantsContextProvider } from './context/RestaurantsContext';
import UpdateReviewPage from './FoodReview/UpdateReviewPage';
import QuizPage from './RandomRestaurantGenerator/QuizPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    };

    async function isAuth() {
        try {
            const response = await fetch("https://restaurant-roulette-backend.vercel.app/auth/verify", {
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
        <RestaurantsContextProvider>
            <Fragment>
                <Router>
                    <Routes>
                        <Route path="/" element={!isAuthenticated ? (<LoginSignupConnected setAuth={setAuth} />) : (<Navigate to="/homepage" />)} />
                        <Route path="/homepage" element={isAuthenticated ? (<HomePage setAuth={setAuth} />) : (<Navigate to="/" />)} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/restaurants/:id" element={<RestaurantPage />} />
                        <Route path="/restaurants/:id/review/:reviewid" element={<UpdateReviewPage />} />
                        <Route path="/random-restaurant-generator" element={<QuizPage />} />
                    </Routes>
                </Router>
                <ToastContainer />
            </Fragment>
        </RestaurantsContextProvider>
    );
}

export default App;
