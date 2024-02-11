import React, { useEffect, useState } from 'react';
import { useGetQuizByCourseIdQuery } from '../../Slices/courseApiSlice';
import './QuizComponent.css'; 
import {useParams} from 'react-router-dom';
import Loader from '../Loader/Loader';
function StudentQuiz() {
  const {id:courseId}=useParams();
  const { data, error, isLoading } = useGetQuizByCourseIdQuery(courseId);
  const [quizData,setQuizData]=useState(null);
  const [answers, setAnswers] = useState([]);
  
  useEffect(()=>{
    if(data && data.quiz){
        setQuizData(data.quiz);
        setAnswers(new Array(data.quiz.questions.length).fill(null));
        console.log(data.quiz);
    }
  },[data,quizData]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleOptionSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (question.answer === answers[index]) {
        score += question.marks;
      }
    });
    return score;
  };

  const renderResult = () => {
    return (
      <div className="result-container">
        <h2>Quiz Result</h2>
        <h3>Your Score: {calculateScore()}</h3>
        <div className="answers-container">
          {quizData.questions.map((question, index) => (
            <div key={index} className="question-answer">
              <p className="question">{question.question}</p>
              <p className="correct-answer">Correct Answer: {question.answer}</p>
              <p className="your-answer">Your Answer: <span className={answers[index] === question.answer ? 'correct' : 'incorrect'}>{answers[index]}</span></p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading || !quizData ) {
    return <Loader/>;
  }
  

  

  if (showResult) {
    return renderResult();
  }

  if (error && error.status === 404) {
    return <h1>No quiz found for the given course ID.</h1>;
  }

  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="quiz-container">
      <div className="question">
        <h2>{quizData.questions[currentQuestionIndex].question}</h2>
      </div>
      <div className="options">
        {quizData.questions[currentQuestionIndex].options.map((option, index) => (
          <div key={index} className="option">
            <input
              type="radio"
              id={`option${index}`}
              name="options"
              value={option}
              checked={answers[currentQuestionIndex] === option}
              onChange={() => handleOptionSelect(option)}
            />
            <label htmlFor={`option${index}`}>{option}</label>
          </div>
        ))}
      </div>
      <div className="navigation">
        <button className='quizzz-button' onClick={handlePrev} disabled={currentQuestionIndex === 0}>Prev</button>
        <button className='quizzz-button' onClick={handleNext} disabled={currentQuestionIndex === quizData.questions.length - 1}>Next</button>
        <button className='quizzz-button' onClick={() => setShowResult(true)}>Finish</button>
      </div>
    </div>
  );
}

export default StudentQuiz;
