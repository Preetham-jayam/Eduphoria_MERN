import React, { useState } from "react";
import { toast } from "react-toastify";
import "./EmailSending.css";
import { useSendMailsMutation } from "../../Slices/adminApiSlice";
import Loader from "../Loader/Loader";

const EmailSendingForm = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sendMail, { isLoading }] = useSendMailsMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubjectError("");
    setMessageError("");

    let isValid = true;

    if (!subject) {
      setSubjectError("Subject is required");
      isValid = false;
    }

    if (!message) {
      setMessageError("Message is required");
      isValid = false;
    }

    if (isValid) {
      try {
        const res = await sendMail({ subject, message }).unwrap();
        console.log(res);
        toast.success("Mail sent succesfully");
        setSubject("");
        setMessage("");
      } catch (error) {
        toast.error(error.message);
      }
      setSubject("");
      setMessage("");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="email-form-container">
      <h1 className="form-title">Email Sending Form</h1>
      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <div className="form-input">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input"
            />
            <div className="error-message">{subjectError}</div>
          </div>

          <div className="form-input">
            <label htmlFor="subject">Description:</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-input"
              rows={5}
            ></textarea>
            <div className="error-message">{messageError}</div>
          </div>
        </div>

        <div className="submitButtton">
              <button type="submit">Send Mail</button>
            </div>
      </form>
    </div>
  );
};

export default EmailSendingForm;
