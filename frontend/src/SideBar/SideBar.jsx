import React, { useState, useEffect } from 'react';
import { Navigate , useNavigate } from 'react-router-dom';
import './SideBar.css';
import profilePic from '../assets/chef_image.png';
import NotificationBackend from '../apis/NotificationBackend';

export const SideBar = ({setAuth}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [notifs, setNotifs] = useState([]);
    const [unreadNotifs, setUnreadNotifs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const getData = async () => {
            try {
                const response = await NotificationBackend.get("/", {
                    headers: {
                        token: token
                    }
                });
                setNotifs(response.data.data);
                if (notifs.length >= 1) {
                    setUnreadNotifs(notifs.filter(notif => {
                        return !notif.is_read
                    }));
                } 
            } catch (err) {
                console.error(err.message);
            }
        };
        getData();
    }, [notifs]);

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
        navigate('/random-restaurant-generator');
    };

    const handleBiteBuddies = () => {
        setIsOpen(false);
        navigate('/bite-buddies');
    };

    const handleFavourites = () => {
        setIsOpen(false);
        navigate('/favourites');
    };

    const handleNotifs = () => {
        setIsOpen(false);
        navigate('/notification')
    }

    async function getName() {
        try {
          const response = await fetch("https://restaurant-roulette-backend.vercel.app/homepage", {
            method: "GET", 
            headers: {token: localStorage.token}
          });
    
          const parseRes = await response.json();
          setName(parseRes.user_name);
    
        } catch (err) {
          console.error(err.message);
        }
      };
      
      // useEffect makes a lot of request so adding the [] helps make sure only 1 request is made
      useEffect(() => {
        getName();
      },[]);
    

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
                        <p className="bold">{name}</p>
                    </div>
                </div>

                <ul>
                <li onClick={handleNotifs}>
                        <a href="#">
                            {unreadNotifs.length > 0 ? (<i className='bx bxs-bell-ring bx-tada' ></i>) :
                                (<i className="bx bxs-bell-ring bx-tada-hover"></i>)}
                            <span className="nav-item">Notifications</span>
                        </a>
                        <span className="tooltip">Notifications</span>
                    </li>

                    <li onClick={handleWhatsNew}>
                        <a href="#">
                            <i className='bx bx-news bx-tada-hover' ></i>
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
