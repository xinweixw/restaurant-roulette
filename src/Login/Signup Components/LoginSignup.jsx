import './LoginSignup.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import userIcon from '../../assets/user_image.png';
import emailIcon from '../../assets/email_image.png';
import passwordIcon from '../../assets/password_image.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loginDisabled, setLoginDisabled] = useState(true);
    const [signupDisabled, setSignupDisabled] = useState(true);
    const [warningMessage, setWarningMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        // Reset inputs when action changes
        setUsername("");
        setEmail("");
        setPassword("");
    }, [action]);

    
    useEffect(() => {
        // Enable login button only when all fields are filled
        if (action === "Login") {
            setLoginDisabled(!username && !password);
            setSignupDisabled(false);
        }
    }, [action, username, password]);
    
    useEffect(() => {
        // Enable sign up button only when all fields are filled
        if (action === "Sign Up") {
            setSignupDisabled(!username || !email || !password);
            setLoginDisabled(false);
        }
    }, [action, username, email, password]);
    
    const handleLogin = () => {
        // Navigate to the login page
        setAction("Login");
        setSuccessMessage("");
        setWarningMessage("");
    };

    const handleSignup = () => {
        // Navigate to the signup page
        setAction("Sign Up");
        setSuccessMessage("");
        setWarningMessage("");
    };

    const handleSubmit = () => {
        // Handle form submission logic
        if (action === "Login") {
            // Navigate to the home page after login
            navigate('/home');
        } else {
            // Navigate to the login page after signup
            setAction("Login");
            setSuccessMessage("Thank you for signing up! Please log in");
        }
    };

    const handleForgotPassword = () => {
        // Navigate to forgot password page
        navigate('/forgot-password');
    };

    const giveWarning = () => {
        //Shows warning message when never fill in required fields
        setWarningMessage("Please fill in all required fields.");
    }


    return (
        <div className='container'>
            <div className='header'>
                <div className="text">{action}</div>
                <div className='underline'></div>
            </div>

            {successMessage && action === "Login" && (
                <div className="successMessage">
                    {successMessage}
                </div>
            )}

            <div className='inputs'>
                {action === "Login" ? null : (
                    <div className="input">
                        <img src={userIcon} alt="" />
                        <input
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setWarningMessage("")} //Clears warning on input change
                             } 
                        />
                    </div>
                )}
                <div className='input'>
                    <img src={emailIcon} alt="" />
                    <input
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setWarningMessage("")} //Clears warning on input change
                         } 
                    />
                </div>
                <div className='input'>
                    <img src={passwordIcon} alt="" />
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setWarningMessage("")} //Clears warning on input change
                         } 
                    />
                </div>
            </div>

            {/*show warning message if fields are empty*/}
            <div className = "warningMessage"> 
                    {warningMessage}
            </div>
    
            {action === "Sign Up" ? null : (
                <div className="forgotPassword">
                    Forgot Password? <span onClick={handleForgotPassword}>Click Here!</span>
                </div>
            )}

            <div className="submitContainer">
                <div
                    className={`submit ${signupDisabled ? "disabled" : ""}`}
                    onClick={signupDisabled ? giveWarning : (action === "Sign Up" ? handleSubmit : handleSignup)}
                    >
                    Sign Up
                </div>
                <div
                    className={`submit ${loginDisabled ? 'disabled' : ""}`}
                    onClick={loginDisabled ? giveWarning : (action === "Login" ? handleSubmit : handleLogin)}
                >
                    Login
                </div>
            </div>
        </div>
    );
}

export default LoginSignup;
