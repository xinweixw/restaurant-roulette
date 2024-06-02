import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        // Handle forgot password logic
        console.log('Forgot password for:', email);
    };

    return (
        <div className = "total">
            <h1>Forgot Password</h1>
            <div className = "submitLine">
            <div className = "input" >
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /> </div>
            <div className = "submitButton">
            <button onClick={handleSubmit}>Submit</button>
            </div></div>
        </div>
    );
};

export default ForgotPassword;
