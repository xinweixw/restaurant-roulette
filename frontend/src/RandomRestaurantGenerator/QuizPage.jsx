import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
    const navigate = useNavigate(); // Corrected declaration

    return (
        <>
            <div className="container text-center my-3">
                <i className="fa-solid fa-mug-saucer"></i>
                <h1>Random Restaurant Generator</h1>
                <i className="fa-solid fa-burger"></i>
                <span className="my-3">take a short quiz & get a restaurant</span>
            </div>
            {/* Corrected onClick handler */}
            <button onClick={() => navigate("/random-restaurant-generator/quiz-questions")}>Start Quiz</button>
            <br />
            {/* <button onClick={() => navigate("/food-search")} className="btn btn-info my-2">Back to Homepage</button> */}
        </>
    )
}

export default QuizPage;
