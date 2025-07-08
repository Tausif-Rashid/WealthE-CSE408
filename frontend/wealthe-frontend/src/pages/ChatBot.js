import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import { chatbotUserQuery } from '../utils/api';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // { sender: 'user'|'gemini', text: string }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    if (!input.trim()) {
      setError('Please enter your question.');
      return;
    }
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await chatbotUserQuery(input);
      // Assume backend returns { response: '...' }
      setMessages((prev) => [...prev, { sender: 'gemini', text: res.response || String(res) }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'gemini', text: 'Failed to get response.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-header">How can I help you?</h1>
      <div className="chatbot-chatbox">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.sender === 'user'
                ? 'chatbot-message chatbot-message-user'
                : 'chatbot-message chatbot-message-gemini'
            }
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="chatbot-message chatbot-message-gemini chatbot-message-loading">
            Gemini is typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="chatbot-form" onSubmit={handleSend}>
        <textarea
          className="chatbot-textarea"
          rows={3}
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button className="chatbot-send-btn" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {error && <div className="chatbot-error">{error}</div>}
    </div>
  );
};

export default ChatBot; 