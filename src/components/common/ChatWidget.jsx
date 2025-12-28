import { useState } from 'react';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'System', text: 'Welcome to the DMS Command Channel.', time: '10:00' },
        { id: 2, sender: 'Alex (Auth)', text: 'Update on District A?', time: '10:05' },
        { id: 3, sender: 'Sarah (Vol)', text: 'Team dispatched. ETA 5 mins.', time: '10:06' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setMessages([...messages, {
            id: Date.now(),
            sender: 'Me',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setNewMessage('');
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
                        <h3>Command Channel</h3>
                        <button onClick={() => setIsOpen(false)}><FaTimes /></button>
                    </div>

                    <div className="chat-body">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender === 'Me' ? 'sent' : 'received'}`}>
                                <div className="sender">{msg.sender}</div>
                                <div className="text">{msg.text}</div>
                                <div className="time">{msg.time}</div>
                            </div>
                        ))}
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
        .received {
          align-self: flex-start;
          background: var(--bg-surface-2);
          border-bottom-left-radius: 2px;
        }
        .sent {
          align-self: flex-end;
          background: var(--primary-light);
          color: black; 
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
