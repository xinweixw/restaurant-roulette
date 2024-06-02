import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ setAuth }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    async function getName() {
        try {
          const response = await fetch("http://localhost:5000/homepage/", {
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
        navigate('/login-signup');
      };

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <button onClick={e => logout(e)}>Logout</button>
        </div>
    );
};

export default HomePage;
