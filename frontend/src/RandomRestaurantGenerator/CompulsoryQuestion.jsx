import React, { useEffect } from 'react';

const CompulsoryQuestion = ({ qnNum, questions, answers, setAnswers }) => {
    const theQuestion = questions[qnNum];

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
                {theQuestion.options.map((option, optIndex) => (
                    <div key={optIndex} className="d-flex align-content-start">
                        <input
                            type="radio"
                            className="form-check-input"
                            name={`question-${qnNum}`}
                            value={qnNum < 2 ? option.opt : option.points}
                            id={optIndex}
                            onChange={() => selectOption(qnNum, qnNum < 2 ? option.opt : option.points)}
                            checked={answers[qnNum] === option.opt}
                        />
                        <label className="form-check-label" htmlFor={optIndex}>
                            {option.opt}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompulsoryQuestion;