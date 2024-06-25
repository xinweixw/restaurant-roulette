import React, { useEffect, useState } from 'react';
import RandomQuizBackend from '../apis/RandomQuizBackend';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const QuizQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to log in to take the quiz");
            return; 
        }

        const getData = async () => {
            try {
                const response = await RandomQuizBackend.get("/", {
                    headers: {
                        token: token
                    }
                });
                setQuestions(response.data.data); 
                setAnswers(Array(response.data.data.length).fill(null));
            } catch (err) {
                console.error(err.message);
            }
        }
        getData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to log in to take the quiz");
            return; 
        }

        try {
            const response = await RandomQuizBackend.post("/submit", {
                answer: answers
            }, {
                headers: {
                    token: token
                }
            }); 
            // console.log(response);
            setRecommendation(response.data.data);
        } catch (err) {
            console.error(err.message);
            toast.warning("Error");
        }
    }

    const selectOption = (index, value) => {
        const newAnswer = [...answers];
        newAnswer[index] = value;
        setAnswers(newAnswer);
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {questions.map((question, index) => {
                    return (
                        <div key={index}>
                            <p>{question.qns}</p>
                            <div>
                                {question.options.map((option, optIndex) => {
                                    return (
                                    <div className="align-left">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name={`question-${index}`}
                                            value={index < 2 ? option.opt : option.points}
                                            id={optIndex}
                                            onChange={() => selectOption(index, index < 2 ? option.opt : option.points)}
                                        />
                                        <label className="form-check-label" htmlFor={optIndex}>
                                            {option.opt}
                                        </label>
                                        <br />
                                    </div>
                                    );

                                })}
                            </div>
                            <br />
                        </div>
                    );
                })}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <br />
            {recommendation && (
                <div className="border border-primary bg-primary bg-opacity-10">
                    <h3>Recommended Restaurant: </h3><br />
                    <div>
                        <img src={recommendation.image_url} className="rounded-float-end" alt="restaurant logo" />
                        <br />
                        <h3>{recommendation.rest_name}</h3>
                        <button onClick={e => navigate(`/restaurants/${recommendation.rest_id}`)} className="btn btn-outline-primary">View Restaurant Page</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuizQuestions;