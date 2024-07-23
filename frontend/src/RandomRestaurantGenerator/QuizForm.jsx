import React, { useEffect, useState } from 'react';
import RandomQuizBackend from '../apis/RandomQuizBackend';
import CompulsoryQuestion from './CompulsoryQuestion';
import RandomQuestion from './RandomQuestion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Popup from '../Favourites/Popup';

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
        return (<h1 className="loadIcon">
          <i className="bx bx-loader-circle bx-spin"/>
          </h1>);
    }

    return (
        <div>
            {!isClicked && (
                <form onSubmit={handleSubmit}>
                    <div className="questions container">
                        {questionDisplay(qn)}
                    </div>
                    <div className="btn-group my-3 p-3" role="group">
                        <button
                            className="btn btn-primary"
                            disabled={qn === 0}
                            type="button"
                            onClick={() => setQn((currQn) => currQn - 1)}
                        >
                            <i className="fa-solid fa-chevron-left"></i> Prev
                        </button>
                        {qn === questions.length - 1 ?
                            <button className="btn btn-primary" type="submit" disabled={answers.includes(0)}>Submit</button>
                            :
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => setQn((currQn) => currQn + 1)}
                            >
                                Next <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        }
                    </div>
                </form>
            )}
            <Popup isClicked={isClicked} setIsClicked={setIsClicked}>
                {recommendation && (
                    <div className="border">
                        <h2>Recommended Restaurant: </h2><br />
                        <div onClick={e => navigate(`/restaurants/${recommendation.rest_id}`)}>
                            <img src={recommendation.image_url} className="rounded-float-end" alt="restaurant logo" style={{maxWidth: "80%"}}/>
                            <br />
                            <h2>{recommendation.rest_name}</h2>
                            {/* <button onClick={e => navigate(`/restaurants/${recommendation.rest_id}`)} className="btn btn-outline-primary">View Restaurant Page</button> */}
                            <br />
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={e => navigate("/random-restaurant-generator")} >Take the Quiz Again</button>
                        </div>
                    </div>
                )}
            </Popup> 
        </div>
    )
}

export default QuizForm;