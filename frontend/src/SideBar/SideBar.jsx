import React, { useState, useEffect } from 'react';
import { Navigate , useNavigate } from 'react-router-dom';
import './SideBar.css';
import profilePic from '../assets/chef_image.png';

export const SideBar = ({setAuth}) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleWhatsNew = () => {
        setIsOpen(false);
        navigate("/what's-new");
    };

    const handleFoodSearch = () => {
        setIsOpen(false);
        navigate('/food-search');
    };

    const handleRoulette = () => {
        setIsOpen(false);
        navigate('/roulette');
    };

    const handleBiteBuddies = () => {
        setIsOpen(false);
        navigate('/bite-buddies');
    };

    const handleFavourites = () => {
        setIsOpen(false);
        navigate('/favourites');
    };


    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
        navigate('/');
      };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="mainContent">
                {/* Menu button */}
                <button className="menuIcon" onClick={toggleSidebar}>
                    <i className="bx bx-menu" id="btn"></i>
                </button>

                {/* User info */}
                <div className="user">
                    <img src={profilePic} alt="profilePic" className="profilePic" />
                    <div>
                        <p className="bold">Username</p>
                    </div>
                </div>

                <ul>
                    <li onClick={handleWhatsNew}>
                        <a href="#">
                            <i className="bx bxs-bell-ring bx-tada-hover"></i>
                            <span className="nav-item">What's New?</span>
                        </a>
                        <span className="tooltip">What's New?</span>
                    </li>

                    <li  onClick={handleFoodSearch}>
                        <a href="#">
                            <i className="bx bx-search-alt bx-tada-hover"></i>
                            <span className="nav-item">Food Search</span>
                        </a>
                        <span className="tooltip">Food Search</span>
                    </li>

                    <li onClick={handleRoulette}>
                        <a href="#">
                            <i className="bx bxs-color bx-spin-hover"></i>
                            <span className="nav-item">Roulette</span>
                        </a>
                        <span className="tooltip">Roulette</span>
                    </li>

                    <li  onClick={handleBiteBuddies}>
                        <a href="#">
                            <i className="bx bxs-group bx-tada-hover"></i>
                            <span className="nav-item">Bite Buddies</span>
                        </a>
                        <span className="tooltip">Bite Buddies</span>
                    </li>

                    <li onClick={handleFavourites}> 
                        <a href="#">
                            <i className="bx bx-heart bx-tada-hover"></i>
                            <span className="nav-item">Favourites</span>
                        </a>
                        <span className="tooltip">Favourites</span>
                    </li>

                    <li onClick={e => logout(e)}>
                        <a href="#">
                            <i className="bx bx-log-out bx-fade-left-hover"></i>
                            <span className="nav-item">Logout</span>
                        </a>
                        <span className="tooltip">Logout</span>
                    </li>
                </ul>

                <div className="bottom">
                    <div className="logo">
                        <span>Restaurant Roulette</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
