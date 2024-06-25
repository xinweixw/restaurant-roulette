import React from 'react';
import QuizQuestions from './QuizQuestions'
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
    let navigate = useNavigate();
    return (
        <>
            <div className="container text-center my-3">
                <i class="fa-solid fa-mug-saucer"></i>
                <h1>Random Restaurant Generator</h1>
                <i class="fa-solid fa-burger"></i>
                <span className="my-3">take a short quiz & get a restaurant</span>
            </div>
            <QuizQuestions />
            <br />
            <button onClick={e => navigate("/homepage")} className="btn btn-info">Back to Homepage</button>
        </>
    )
}

export default QuizPage;