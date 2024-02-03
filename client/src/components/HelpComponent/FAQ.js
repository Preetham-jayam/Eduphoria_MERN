import React, { useState } from 'react';
import { FaPlus, FaMinus, FaCheck } from 'react-icons/fa';
import './FAQ.css';
const FAQ = () => {
  const [questions, setQuestions] = useState([
    {
      question: 'How do I know the right course for me?',
      answer: 'List the interests of your concepts then choose the right course accordingly',
    },
    {
      question: 'Do I get a certificate for every course I take?',
      answer: 'Yes, you will get the certificate after completion of the course.',
    },
    {
      question: 'Is the course has lifetime access?',
      answer: 'Once the course is purchased then it is full-time access.',
    },
    {
      question: 'What is eLearning?',
      answer: 'To put it simply, eLearning is electronic learning, and it typically includes a combination of electronic media and educational technology. E-learning is computer-based and makes use of multimedia sources such as text, audio, animations, images, and so on.',
    },
    {
      question: 'Can I customize eLearning courses?',
      answer: 'While there are many off-the-shelf ready-made courses available in the market, eLearning courses can be customized to your specifications. Many corporate bigwigs utilize this feature of eLearning to train their staff on specific subjects. Customization helps in providing a better understanding of the processes and principles in an organization. You can opt for a customized eLearning course when your training needs are unique and confidential. For instance, the procure to pay (P2P) process differs from organization to organization. In such cases, it is ideal to have a customized eLearning course.',
    },
    {
      question: 'How much does an eLearning course cost?',
      answer: 'E-learning is a one-time investment, and once you have your course, you can use it as many times as you want. You can save precious dollars by eliminating the need for repeated presence of the trainer. Building and delivering eLearning include activities such as conducting a training needs analysis, comprehending the content, developing an instructional strategy, identifying the best delivery method like LMS, assessing the extent of customization, and so on.',
    },
  ]);

  const toggleAnswer = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].isOpen = !newQuestions[index].isOpen;
    setQuestions(newQuestions);
  };

  return (
    <section className="faqs">
      
      <div className="container faqs_container">
        <div className="faq-heading">
          <h2>Frequently asked questions</h2>
        </div>
        {questions.map((q, index) => (
          <article className={`faq ${q.isOpen ? 'open' : ''}`} key={index} onClick={() => toggleAnswer(index)}>
            <div className="faq_icon">
              {q.isOpen ? <FaMinus /> : <FaPlus />}
            </div>
            <div className="question_answer">
              <h4>{q.question}</h4>
              {q.isOpen && <p>{q.answer}</p>}
            </div>
          </article>
        ))}
        <form className="qForm" id="helpfrm" >
          <label htmlFor="question">Questions:</label><br />
          <input id="question" name="question" style={{ fontSize: '15pt', margin: '5px', width: '100%' }} />

          <div className="button-div">
            <button type="submit" className="btn-submit">
              <FaCheck /> Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FAQ;
