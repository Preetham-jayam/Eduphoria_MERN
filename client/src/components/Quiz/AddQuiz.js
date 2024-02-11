import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useAddQuizToCourseMutation } from '../../Slices/teacherApiSlice';
import { useGetQuizByCourseIdQuery } from '../../Slices/courseApiSlice';
import {toast} from 'react-toastify';
import './AddQuiz.css';
import Loader from '../Loader/Loader';

const AddQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const { id: courseId } = useParams();
  const navigate=useNavigate();

  const [addQuizToCourse, { isLoading, isError, error }] = useAddQuizToCourseMutation();
  const { data: quizData, isLoading: quizLoading } = useGetQuizByCourseIdQuery(courseId);

  useEffect(() => {
    if (quizData) {
      setQuestions(quizData.quiz.questions);
      setTitle(quizData.quiz.title);
    }
  }, [quizData]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], answer: '', marks: 1 },
    ]);
  };

  const handleSaveQuiz = async () => {
    try {
      const quizData = {
        title: title,
        questions: questions,
      };

      const result = await addQuizToCourse({ courseId: courseId, ...quizData });

      console.log('Quiz added successfully:', result);

      setTitle('');
      setQuestions([]);

      navigate(`/courseContent/${courseId}`);
      toast.success("Quiz questions added succesfully");
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  if (isLoading || quizLoading) {
    return <Loader />;
  }

  return (
    <div className="add-quiz-container">
      <h2 className="main-heading">Add Quiz</h2>
      <input
        className="quiz-title-input"
        type="text"
        placeholder="Enter quiz title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <h3>Question {index + 1}</h3>
          <input
            className="question-input"
            type="text"
            placeholder="Enter your question"
            value={question.question}
            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
          />
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="option-container">
              <label htmlFor={`option-${index}-${optionIndex}`} className="option-label">
                Option {String.fromCharCode(65 + optionIndex)}
              </label>
              <input
                id={`option-${index}-${optionIndex}`}
                className="option-input"
                type="text"
                placeholder={`Enter option ${String.fromCharCode(65 + optionIndex)}`}
                value={option}
                onChange={(e) =>
                  handleQuestionChange(index, 'options', [
                    ...question.options.slice(0, optionIndex),
                    e.target.value,
                    ...question.options.slice(optionIndex + 1),
                  ])
                }
              />
            </div>
          ))}
          <div className="answer-container">
            <label htmlFor={`answer-${index}`} className="answer-label">
              Correct Answer
            </label>
            <input
              id={`answer-${index}`}
              className="answer-input"
              type="text"
              placeholder="Enter correct answer"
              value={question.answer}
              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
            />
          </div>
        </div>
      ))}
      <button className="add-question-button" onClick={handleAddQuestion}>
        Add Question
      </button>
      <button className="save-quiz-button" onClick={handleSaveQuiz}>
        Save Quiz
      </button>
      {isLoading && <Loader />}
      {isError && <p className="error-message">Error: {error.message}</p>}
    </div>
  );
  
  
};

export default AddQuiz;
