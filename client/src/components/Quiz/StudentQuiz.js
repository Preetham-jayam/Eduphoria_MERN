import React, { useEffect, useState } from 'react';
import { useGetQuizByCourseIdQuery } from '../../Slices/courseApiSlice';
import { useUpdateQuizResultsMutation } from '../../Slices/studentApiSlice';
import { useGetUserDetailsQuery } from '../../Slices/usersApiSlice';
import './QuizComponent.css'; 
import { useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

function StudentQuiz() {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const { data, error, isLoading } = useGetQuizByCourseIdQuery(courseId);
  const { data: userData, isLoading: userLoading } = useGetUserDetailsQuery(auth.userInfo?.userId);
  const [updateQuizResults, { isLoading: isUpdating }] = useUpdateQuizResultsMutation();
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAttemptedQuiz, setUserAttemptedQuiz] = useState(false);

  useEffect(() => {
    if (data && data.quiz) {
      setQuizData(data.quiz);
      setAnswers(new Array(data.quiz.questions.length).fill(null));
    }
  }, [data]);

  useEffect(() => {
    if (userData) {
      setUser(userData.user);

      const attemptedQuiz = userData.user.student.quizzes.find(quiz => quiz.course._id === courseId);
      if (attemptedQuiz) {
        setUserAttemptedQuiz(true);
        setAnswers(JSON.parse(attemptedQuiz.answers));
      } else{
        setUserAttemptedQuiz(false);
      }
    }
  }, [userData, courseId]);

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

  const handleFinishQuiz = async () => {
    if (answers.some(answer => answer === null)) {
      toast.error('Please answer all questions before submitting.');
      return;
    }
    try {
      await updateQuizResults({
        studentId: user.student._id,
        quizId: quizData._id,
        courseId,
        marks: calculateScore(),
        totalMarks: quizData.questions.length,
        answers: JSON.stringify(answers) 
      });
      setShowResult(true);
      setUserAttemptedQuiz(true); 
    } catch (error) {
      console.error('Error updating quiz results:', error);
    }
  };

  const handleRetryQuiz = () => {
    setAnswers(new Array(quizData.questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setUserAttemptedQuiz(false);
  };

  const renderResult = () => {
    return (
      <div className="result-container">
        <h2>Quiz Result</h2>
        <h3>Your Score: {calculateScore()} out of {quizData.questions.length}</h3>
        <div className="answers-container">
          {quizData.questions.map((question, index) => (
            <div key={index} className="question-answer">
              <p className="question">{question.question}</p>
              <p className="correct-answer">Correct Answer: {question.answer}</p>
              <p className="your-answer">Your Answer: <span className={answers[index] === question.answer ? 'correct' : 'incorrect'}>{answers[index]}</span></p>
            </div>
          ))}
        </div>
        <button className='quizzz-button' onClick={() => navigate(`/courseContent/${courseId}`)}>Return to Course</button>
      </div>
    );
  };

  if (isLoading  || userLoading) {
    return <Loader />;
  }

  if(!quizData){
    return <h1>Quiz questions not added yet!!</h1>
  }

  if (showResult) {
    return renderResult();
  }

  if (userAttemptedQuiz) {
    const attemptedQuiz = userData.user.student.quizzes.find(quiz => quiz.course._id === courseId);
    return (
      <div className="quiz-container">
        <h2>You have already attempted this quiz.</h2>
        <h3>Your Score: {attemptedQuiz.marks} out of {quizData.questions.length}</h3>
        <button className='quizzz-button' onClick={handleRetryQuiz} disabled={isUpdating}>Try Again ?</button>
      </div>
    );
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
      <div className="navigation-tabs">
        <button className='quizzz-button' onClick={handlePrev} disabled={currentQuestionIndex === 0}>Prev</button>
        <button className='quizzz-button' onClick={handleNext} disabled={currentQuestionIndex === quizData.questions.length - 1}>Next</button>
        <button className='finish-button' onClick={handleFinishQuiz} disabled={isUpdating}>Submit</button>
      </div>
    </div>
  );
}

export default StudentQuiz;
