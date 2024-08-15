import React, { useState, useEffect } from 'react';
import "./QuizStyles.css";

const RandomQuestion = ({ qnNum, questions, answers, setAnswers }) => {
  const theQuestion = questions[qnNum];
  const [optSelected, setOptSelected] = useState([]);

  useEffect(() => {
    if (theQuestion) {
      console.log(questions);
      console.log(theQuestion);
    }
  }, [questions, theQuestion]);

  const selectOption = (index, value) => {
    const newAnswer = [...answers];
    newAnswer[index] = value;
    setAnswers(newAnswer);
  }

  return (
    <div>
      <h3 className="text-center">{questions[qnNum].qns}</h3>
      <div>
        {questions[qnNum].options.map((option, optIndex) => {
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
                checked={answers[qnNum] === option.points}
              />
              <label 
                  className={`option-label ${answers[qnNum] === value ? 'selected' : ''}`}
                  htmlFor={optIndex}>
                    {option.opt}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RandomQuestion; 