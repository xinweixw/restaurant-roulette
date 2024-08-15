import React, { useEffect, useState } from 'react';
import "./QuizStyles.css";

const CompulsoryQuestion = ({ qnNum, questions, answers, setAnswers }) => {
    const theQuestion = questions[qnNum];
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (theQuestion) {
            console.log(questions);
            console.log(theQuestion);
        }
    }, []);

    const selectOption = (index, value) => {
        const newAnswer = [...answers];
        newAnswer[index] = value;
        setAnswers(newAnswer);
    }

    if (!theQuestion) return null;

    return (
        <div>
            <h3 className="text-center">{theQuestion.qns}</h3>
            <div>
                {theQuestion.options.map((option, optIndex) => {
                    const value = qnNum < 2 ? option.opt : option.points;
                    return (
                    <div 
                        key={optIndex} 
                        className={`option-container ${answers[qnNum] === value ? 'selected' : ''}`}
                        // onClick={() => selectOption(optIndex, value)}
                    >
                        <input
                            type="radio"
                            className="option-input"
                            name={`question-${qnNum}`}
                            value={qnNum < 2 ? option.opt : option.points}
                            id={optIndex}
                            onChange={() => selectOption(qnNum, qnNum < 2 ? option.opt : option.points)}
                            checked={answers[qnNum] === option.opt}
                        />
                        <label 
                            className={`option-label ${answers[qnNum] === value ? 'selected' : ''}`}
                            htmlFor={optIndex}>
                            {option.opt}
                        </label>
                    </div>
                )})}
            </div>
        </div>
    );
}

export default CompulsoryQuestion;