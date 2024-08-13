import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBackend from '../apis/NotificationBackend';
import Notifications from './Notifications';
import "./Notification.css";


const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [unreadNotifs, setUnreadNotifs] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleRead = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setLoading(true);
      const response = await NotificationBackend.put("/", {
      }, {
        headers: {
          token: token
        }
      });

      setNotifs(response.data.data);
      setUnreadNotifs([]);
    } catch (err) {
      console.error(err.message); 
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setLoading(true);
      const response = await NotificationBackend.delete("/", {
        headers: {
          token: token
        }
      });
      setNotifs([]);
      setUnreadNotifs([]);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (<h1 className="loadIcon">
      <i className="bx bx-loader-circle bx-spin"/>
      </h1>);
  }

  return (
    <div>
      <button onClick={() => navigate("/food-search")} className="back-button"><i className="fa-solid fa-chevron-left"></i></button>
      <div className = "container" style={{background:'transparent'}}>
        <h1>Notifications Page</h1>
        <h5>You have {unreadNotifs.length} unread {unreadNotifs.length < 1 ? "notification" : "notifications"}</h5>
        <div className= "button-container">
          {notifs.length < 1 ? (
            <>
              <button className="overall-btn" disabled={true}>Mark All as Read</button>
              <button className="overall-btn" disabled={true}>Clear All</button>
            </>
          ) : unreadNotifs.length < 1 ? (
            <>
              <button className="overall-btn" disabled={true}>Mark All as Read</button>
              <button className="overall-btn" onClick={e => handleClear(e)}>Clear All</button>
            </>
          ) : (
            <>
              <button className="overall-btn" onClick={e => handleRead(e)}>Mark All as Read</button>
              <button className="overall-btn" onClick={e => handleClear(e)}>Clear All</button>
            </>
          )}
        </div>
      </div>

      <div className="notifs-container">
        <Notifications notifs={notifs} setNotifs={setNotifs} />
      </div>
    </div>
  )
}

export default NotificationPage;