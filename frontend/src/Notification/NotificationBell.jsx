import React, { useState, useEffect } from 'react';
import NotificationBackend from '../apis/NotificationBackend';
import notificationPic from '../assets/notification.png';
import { useNavigate } from 'react-router-dom';
import "./Notification.css";

const NotificationBell = () => {
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

    return (
        <>
            {unreadNotifs.length >= 1 ? (
                <button 
                    className="bell" 
                    onClick={() => navigate("/notification")}>
                        <img src={notificationPic} alt="unread notification pic"/>
                </button>
                ) : (
                    <button 
                        className="bell" 
                        onClick={() => navigate("/notification")}>
                            <i className="fa-regular fa-bell"></i>
                    </button>)}
        </>
    )
}

export default NotificationBell;