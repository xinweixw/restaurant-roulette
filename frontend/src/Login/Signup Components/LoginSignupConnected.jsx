import './LoginSignup.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import userIcon from '../../assets/user_image.png';
import emailIcon from '../../assets/email_image.png';
import passwordIcon from '../../assets/password_image.png';

const LoginSignupConnected = ({ setAuth }) => {
    const [action, setAction] = useState("Sign Up");
    const navigate = useNavigate();
    const [loginDisabled, setLoginDisabled] = useState(true);
    const [signupDisabled, setSignupDisabled] = useState(true);
    const [warningMessage, setWarningMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [inputs, setInputs] = useState({
        email: "", 
        password: "", 
        name: ""
    }); 

    const { email, password, name } = inputs;

    useEffect(() => {
        setInputs({ email:"", password:"", name:"" });
        setAuth(false);
    }, [action, setAuth]);

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
        setWarningMessage("");
    };

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
    
    useEffect(() => {
        if (action === "Login") {
            setLoginDisabled(!(email && password));
            setSignupDisabled(false);
        } else {
            setSignupDisabled(!(name && email && password));
            setLoginDisabled(false);
        }
    }, [action, name, email, password]);

    const onLogin = async (e) => {
        e.preventDefault(); 
        try {
            const body = { email, password };
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST", 
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify(body)
            }); 
            const parseRes = await response.json();
            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token);
                setAuth(true); 
                navigate('/homepage');
                toast.success('Login Successful');
            } else {
                setAuth(false);
                setWarningMessage('Invalid Email or Password');
            }
        } catch (err) {
            console.error(err.message);
            setWarningMessage("An error occurred. Please try again."); 
        }
    }

    const onSignUp = async (e) => {
        e.preventDefault();
        try {
            const body = { email, password, name };
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token);
                setAction("Login"); 
                setSuccessMessage("Thank you for signing up! Please log in");
            } else {
                setWarningMessage("Sign up failed. Please try again.");
            }
        } catch (err) {
            console.error(err.message);
            setWarningMessage("An error occurred. Please try again.");
        }
    }

    const handleSubmit = (e) => {
        if (action === "Login") {
            onLogin(e);
        } else {
            onSignUp(e);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const giveWarning = () => {
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

            <form onSubmit={handleSubmit}>
                <div className='inputs'>
                    {action === "Login" ? null : (
                        <div className="input">
                            <img src={userIcon} alt="" />
                            <input
                                type="text"
                                placeholder='Name'
                                name='name'
                                value={name}
                                onChange={(e) => onChange(e)} 
                            />
                        </div>
                    )}
                    <div className='input'>
                        <img src={emailIcon} alt="" />
                        <input
                            type="email"
                            placeholder='Email'
                            name='email'
                            value={email}
                            onChange={(e) => onChange(e)} 
                        />
                    </div>
                    <div className='input'>
                        <img src={passwordIcon} alt="" />
                        <input
                            type="password"
                            placeholder='Password'
                            name='password'
                            value={password}
                            onChange={(e) => onChange(e)} 
                        />
                    </div>
                </div>
            </form>

                <div className="warningMessage"> 
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

export default LoginSignupConnected;
