import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBackend from '../apis/NotificationBackend';
import Notifications from './Notifications';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [unreadNotifs, setUnreadNotifs] = useState([]);

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
    }
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await NotificationBackend.delete("/", {
        headers: {
          token: token
        }
      });
      setNotifs([]);
      setUnreadNotifs([]);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/food-search")} className="d-flex justify-content-start"><i className="fa-solid fa-chevron-left"></i></button>
      <div>
        <h1 className="text-center">Notification Page</h1>
        <h5 className="text-center my-2 p-3">You have {unreadNotifs.length} unread {unreadNotifs.length < 1 ? "notification" : "notifications"}</h5>
        <div className="d-flex justify-content-end">
          {notifs.length < 1 ? (
            <>
              <button type="button" className="btn btn-primary" disabled>Mark All as Read</button>
              <button type="button" className="btn btn-secondary" disabled>Clear All</button>
            </>
          ) : unreadNotifs.length < 1 ? (
            <>
              <button type="button" className="btn btn-info" disabled>Mark All as Read</button>
              <button type="button" className="btn btn-secondary" onClick={e => handleClear(e)}>Clear All</button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-info" onClick={e => handleRead(e)}>Mark All as Read</button>
              <button type="button" className="btn btn-secondary" onClick={e => handleClear(e)}>Clear All</button>
            </>
          )}
        </div>
      </div>

      <div className="my-3 p-3">
        <Notifications notifs={notifs} setNotifs={setNotifs} />
      </div>
    </div>
  )
}

export default NotificationPage;