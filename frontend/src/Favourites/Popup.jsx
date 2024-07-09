import React from 'react';
import './Popup.css';

function Popup(props) {
    return (props.isClicked) ? (
      <div className="popup">
          <div className="popup-inner">
              <button className="close-btn" onClick={() => props.setIsClicked(false)}><i className="fa-solid fa-x"></i></button>
              { props.children }
          </div>
      </div>
    ) : "";
}

export default Popup;