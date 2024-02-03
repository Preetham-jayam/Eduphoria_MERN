import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GoBack.css'
const GoBackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleGoBack} className='go-back'>Go Back</button>
  );
};

export default GoBackButton;
