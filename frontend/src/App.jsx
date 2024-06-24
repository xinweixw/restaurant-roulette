// App.js
import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginSignupConnected from './Login/Signup Components/LoginSignupConnected';
import HomePage from './Login/HomePage Components/HomePage';
import ForgotPassword from './Login/Signup Components/ForgotPassword';
import RestaurantPage from './FoodReview/RestaurantPage';
import SearchPage from './FoodSearch/SearchPage'
import { RestaurantsContextProvider } from './context/RestaurantsContext';
//import UpdateReviewPage from './FoodReview/UpdateReviewPage';
//import QuizPage from './RandomRestaurantGenerator/QuizPage';
import { SideBar } from './SideBar/SideBar';

//                        <Route path="/restaurants/:id/review/:reviewid" element={isAuthenticated ? (<Layout setAuth={setAuth}> <UpdateReviewPage setAuth={setAuth} /> </Layout>) : (<Navigate to="/" />)} />
//                        <Route path="/roulette" element={isAuthenticated ? (<Layout setAuth={setAuth}><QuizPage /></Layout>) : (<Navigate to="/" />)} />


// Sidebar layout
const Layout = ({ children, setAuth }) => (
    <div className="layout">
        <SideBar setAuth={setAuth} />
        <div className="content">
            {children}
        </div>
    </div>
);

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
                        <Route path="/" element={!isAuthenticated ? (<LoginSignupConnected setAuth={setAuth} />) : (<Navigate to="/food-search" />)} />
                        <Route path="/homepage" element={isAuthenticated ? (<Layout setAuth={setAuth}> <HomePage setAuth={setAuth} /> </Layout>) : (<Navigate to="/" />)} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/food-search" element={isAuthenticated ? (<Layout setAuth={setAuth}> <SearchPage setAuth={setAuth} /> </Layout>) : (<Navigate to="/" />)} />
                        <Route path="/restaurants/:id" element={isAuthenticated ? (<Layout setAuth={setAuth}> <RestaurantPage setAuth={setAuth} /> </Layout>) : (<Navigate to="/" />)} />
                        <Route path="/what's-new" element={isAuthenticated ? (<Layout setAuth={setAuth}><div>What's New</div></Layout>) : (<Navigate to="/" />)} />
                        <Route path="/favourites" element={isAuthenticated ? (<Layout setAuth={setAuth}><div>Favourites</div></Layout>) : (<Navigate to="/" />)} />
                        <Route path="/bite-buddies" element={isAuthenticated ? (<Layout setAuth={setAuth}><div>Bite Buddies</div></Layout>) : (<Navigate to="/" />)} />
                    </Routes>
                </Router>
                <ToastContainer />
            </Fragment>
        </RestaurantsContextProvider>
    );
}

export default App;
