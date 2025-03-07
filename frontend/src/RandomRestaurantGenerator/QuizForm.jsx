import React, { useEffect, useState } from 'react';
import RandomQuizBackend from '../apis/RandomQuizBackend';
import CompulsoryQuestion from './CompulsoryQuestion';
import RandomQuestion from './RandomQuestion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Popup from '../Favourites/Popup';
// import "./QuizForm.css";
import "./QuizForm.css";
import Loading from '../assets/Loading';


const QuizForm = () => {
    const [qn, setQn] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState(null);
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to log in to take the quiz");
            return;
        }

        const getData = async () => {
            try {
                setLoading(true);
                const response = await RandomQuizBackend.get("/", {
                    headers: {
                        token: token
                    }
                });
                const result = response.data.data;
                setQuestions(result);
                setAnswers(Array(result.length).fill(0)); // change from null
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    // const questionDisplay = (qn) => {
    //     if (qn === 0) {
    //         return <CompulsoryQuestion qnNum={qn} questions={questions} answers={answers} setAnswers={setAnswers} />
    //     } else if (qn === 1) {
    //         return <QuestionTwo qnNum={qn} questions={questions} answers={answers} setAnswers={setAnswers} />
    //     } else if (qn === 2) {
    //         return <RandomQuestion qnNum={qn} questions={questions} answers={answers} setAnswers={setAnswers} />
    //     } else if (qn === 3) {
    //         return <QuestionFour qnNum={qn} questions={questions} answers={answers} setAnswers={setAnswers}/>
    //     } else {
    //         return <QuestionFive qnNum={qn} questions={questions} answers={answers} setAnswers={setAnswers}/>
    //     }
    // };

    const questionDisplay = (qn) => {
        if (qn < 2) {
            return <CompulsoryQuestion qnNum={qn} questions={questions} answers={answers} setAnswers={setAnswers} />
        } else {
            return <RandomQuestion qnNum={qn} questions={questions} answers={answers} setAnswers={setAnswers} />
        }
    };

    const giveWarning = () => {
        toast('Please answer all the questions');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to log in to take the quiz");
            return; 
        }
        if (answers.includes(0)) {
            giveWarning();
            return;
        }

        try {
            setLoading(true);
            const response = await RandomQuizBackend.post("/submit", {
                answer: answers
            }, {
                headers: {
                    token: token
                }
            });
            setRecommendation(response.data.data);
            setIsClicked(true);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
        console.log("Submitted!");
    }

    if (loading) {
        return (
            <h1><Loading/></h1>);
    }

    return (
        <div>
            {!isClicked && (
                <form onSubmit={handleSubmit}>
                    <div className="questions container">
                        {questionDisplay(qn)}
                    </div>
                    <div className="btn-group" role="group">
                        <button
                            className="btn"
                            disabled={qn === 0}
                            type="button"
                            onClick={() => setQn((currQn) => currQn - 1)}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        {qn === questions.length - 1 ?
                            <button className="btn" type="submit" disabled={answers.includes(0)}>Submit</button>
                            :
                            <button
                                className="btn"
                                type="button"
                                onClick={() => setQn((currQn) => currQn + 1)}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        }
                    </div>
                </form>
            )}
            <Popup isClicked={isClicked} setIsClicked={setIsClicked}>
                {recommendation ? (
                    <div className="popup-content">
                        <h2>Recommended Restaurant: </h2><br />
                        <div onClick={e => navigate(`/restaurants/${recommendation.rest_id}`)}>
                            <img src={recommendation.image_url} className="rounded-float-end" alt="restaurant logo" style={{maxWidth: "80%"}}/>
                            <br />
                            <h3>{recommendation.rest_name}</h3>
                            {/* <button onClick={e => navigate(`/restaurants/${recommendation.rest_id}`)} className="btn btn-outline-primary">View Restaurant Page</button> */}
                            <br />
                        </div>
                        <div>
                            <button className="btn-popup" onClick={e => navigate("/random-restaurant-generator")} >Take the Quiz Again</button>
                        </div>
                    </div>
                ) : (
                    <div className="popup-content">
                        <h2 className="text-start">Sorry it looks like there are no restaurants that match your preferences! Please take the quiz again. <i className="fa-regular fa-face-grin-beam-sweat"></i></h2>
                        <div className="my-2 p-2">
                            <button className="btn-popup" onClick={e => setIsClicked(false)}>Edit Preferences</button>
                            <button className="btn-popup" onClick={e => navigate("/random-restaurant-generator")} >Take the Quiz Again</button>
                        </div>
                    </div>
                )}
            </Popup> 
        </div>
    )
}

export default QuizForm;