import React from 'react';
import NotificationBackend from '../apis/NotificationBackend';

const Notifications = ({ notifs, setNotifs }) => {

  const handleClick = async (e, notifId, index) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await NotificationBackend.put(`/${notifId}`, {
        
      }, {
        headers: {
          token: token
        }
      });
      const newNotifs = [...notifs];
      newNotifs[index] = response.data.data.updatedNotif;
      setNotifs(newNotifs);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (e, notifId) => {
    e.stopPropagation(); 
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await NotificationBackend.delete(`/${notifId}`, {
        headers: {
          token: token
        }
      });
      setNotifs(notifs.filter(notification => {
        return notification.notif_id !== notifId
      }));

    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <div className="row">
      {notifs && notifs.map((notif, index) => {
        return (
          <div className="card my-2 p-3" key={index}>
            <div className="card-body">
              <h5 className="card-title text-start">{notif.notif_type}</h5>
              <p className="card-text text-start">{notif.notif_msg}</p>
              <div className="btn-group d-flex justify-content-end" role="group">
                {notif.is_read ? (<button className="btn btn-primary btn-sm" disabled>Read</button>) : (<button className="btn btn-primary btn-sm" type="button" onClick={(e) => handleClick(e, notif.notif_id, index)}>Mark As Read</button>)}
                <button className="btn btn-sm btn-outline-dark" type="button" onClick={e => handleDelete(e, notif.notif_id)}><i className="fa-solid fa-x"></i></button>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-end">
              {notif.notif_date}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Notifications;