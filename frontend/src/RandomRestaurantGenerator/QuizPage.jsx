import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./QuizStyles.css";

const QuizPage = () => {
    const navigate = useNavigate(); // Corrected declaration

    return (
        <>
            <div className="roulette-container text-center my-3">

                <div className="icon-container">
                    <i className='bx bxs-pear'></i>
                    <i className='bx bx-cheese'></i>
                    <i className="fa-solid fa-burger"></i>
                    <i className='bx bxs-coffee-bean' ></i>
                    <i className='bx bxs-bowl-rice'></i>
                </div>

                <h1 className="Title">Random Restaurant Generator</h1>
                <span className="my-3">take a short quiz & get your next restaurant!</span>
            </div>
            {/* Corrected onClick handler */}
            <button onClick={() => navigate("/random-restaurant-generator/quiz-questions")}>Start Quiz</button>
            <br />
            {/* <button onClick={() => navigate("/food-search")} className="btn btn-info my-2">Back to Homepage</button> */}
        </>
    )
}

export default QuizPage;
