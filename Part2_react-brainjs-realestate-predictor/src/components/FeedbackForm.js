import React, { useState } from "react";
import '../styles/feedBackStyles1.css';

const FeedbackForm = ({ predictedPrice, actualPrice, propertyInput }) => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!predictedPrice) {
      setMessage("Please make a prediction first.");
      setMessageType("prediction-message");
      return;
    }

    if (!feedback.trim()) {
      setMessage("Please provide feedback.");
      setMessageType("error-message");
      return;
    }

    const feedbackData = {
      feedback,
      predictedPrice,
      actualPrice,
      propertyDetails: propertyInput,
      timestamp: new Date().toISOString(),
    };

    try {
      await storeFeedbackInIndexedDB(feedbackData);
      setMessage("Thank you for your feedback!");
      setMessageType("success-message");
      setFeedback("");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (error) {
      setMessage("Error submitting feedback. Please try again.");
      setMessageType("error-message");
    }
  };

  const storeFeedbackInIndexedDB = async (feedbackData) => {
    const db = await openDatabase();
    const transaction = db.transaction(["Feedback"], "readwrite");
    const objectStore = transaction.objectStore("Feedback");
    await objectStore.add(feedbackData);
    db.close();
  };

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("FeedbackDB", 1);
      request.onerror = () => reject(new Error("Failed to open database"));
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("Feedback", { keyPath: "timestamp" });
      };
    });
  };

  return (
    <div className="form-container">
      <h2 className="logo-container">Feedback</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="feedback">Your thoughts on the prediction:</label>
          <textarea
            id="feedback"
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your feedback here..."
          />
        </div>
        <button type="submit" className="form-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
