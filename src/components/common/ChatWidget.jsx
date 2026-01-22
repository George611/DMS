import { useState, useRef, useEffect } from 'react';
import { FaComments, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';
import api from '../../api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the DMS Command Channel. I am your AI Assistant.', time: '10:00' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatBodyRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'Me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Prepare history for Gemini (transforming to {role, parts})
      const history = messages
        .filter(m => m.sender !== 'System')
        .map(m => ({
          role: m.sender === 'Me' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const response = await api.post('/chat/gemini', {
        message: userMessage.text,
        history
      });

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'Gemini AI',
        text: response.data.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'System',
        text: 'Sorry, I am having trouble connecting right now. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <FaComments />
          <span className="badge">1</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-window card glass">
          <div className="chat-header">
            <div className="flex items-center gap-2">
              <FaRobot className="text-xl" />
              <span>DMS AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>


          <div className="chat-body" ref={chatBodyRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender === 'Me' ? 'sent' :
                msg.sender === 'System' ? 'system' : 'ai'}`}>
                <div className="sender">{msg.sender}</div>
                <div className="text">{msg.text}</div>
                <div className="time">{msg.time}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message ai typing">
                <div className="sender">Gemini AI</div>
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>


          <form onSubmit={sendMessage} className="chat-input hover:bg-surface-2 transition-colors">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
            />
            <button type="submit" className="text-primary"><FaPaperPlane /></button>
          </form>
        </div>
      )}

      <style>{`
        .chat-widget {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
        }
        .chat-toggle {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          position: relative;
        }
        .chat-toggle .badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--danger);
          font-size: 0.75rem;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          border: 2px solid var(--bg-body);
        }
        
        .chat-window {
          width: 320px;
          height: 450px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          background: var(--bg-surface);
        }
        .chat-header {
          padding: 1rem;
          background: var(--primary);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
        }
        .chat-body {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .message {
          max-width: 80%;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }
        .received, .ai {
          align-self: flex-start;
          background: var(--bg-surface-2);
          border-bottom-left-radius: 2px;
        }
        .ai {
          border-left: 3px solid var(--primary);
        }
        .system {
          align-self: center;
          background: rgba(var(--primary-hue), 0.1);
          color: var(--primary);
          font-weight: 500;
          text-align: center;
          width: 90%;
          font-size: 0.8rem;
        }
        .sent {
          align-self: flex-end;
          background: var(--primary);
          color: white; 
          border-bottom-right-radius: 2px;
        }
        .sender {
          font-size: 0.7rem;
          font-weight: 600;
          margin-bottom: 2px;
          opacity: 0.7;
        }
        .time {
          font-size: 0.65rem;
          opacity: 0.6;
          text-align: right;
          margin-top: 2px;
        }
        
        .typing {
           padding: 0.5rem 1rem;
        }
        .typing-dots {
          display: flex;
          gap: 4px;
        }
        .typing-dots span {
          width: 6px;
          height: 6px;
          background: var(--primary);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        .chat-input {

          padding: 0.75rem;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 0.5rem;
        }
        .chat-input input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
