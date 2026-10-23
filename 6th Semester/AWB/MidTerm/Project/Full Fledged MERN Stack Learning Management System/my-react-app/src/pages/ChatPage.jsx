import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { courseId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join:course', { courseId });

    socket.on('chat:history', (history) => setMessages(history));
    socket.on('chat:message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('chat:typing', ({ userId, name }) => {
      if (userId === user?._id) return;
      setTypingUsers((prev) => [...new Set([...prev, name])]);
      setTimeout(() => setTypingUsers((prev) => prev.filter((n) => n !== name)), 2000);
    });

    return () => {
      socket.emit('leave:course', { courseId });
      socket.off('chat:history');
      socket.off('chat:message');
      socket.off('chat:typing');
    };
  }, [socket, courseId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    socket.emit('chat:send', { courseId, content: input.trim() });
    setInput('');
  };

  const handleTyping = () => {
    if (!socket) return;
    socket.emit('chat:typing', { courseId });
    clearTimeout(typingTimeout.current);
  };

  const roleBadge = (role) => {
    const map = { instructor: 'bg-warning text-dark', admin: 'bg-danger', student: 'bg-secondary' };
    return map[role] || 'bg-secondary';
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header fw-bold">
              💬 Course Chat
            </div>

            {/* Messages */}
            <div className="card-body overflow-auto flex-grow-1 p-3">
              {messages.map((msg, i) => {
                const isOwn = msg.sender?._id === user?._id;
                return (
                  <motion.div
                    key={msg._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`d-flex mb-3 ${isOwn ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div style={{ maxWidth: '70%' }}>
                      {!isOwn && (
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <small className="fw-semibold">{msg.sender?.name}</small>
                          <span className={`badge ${roleBadge(msg.sender?.role)} small`} style={{ fontSize: 9 }}>
                            {msg.sender?.role}
                          </span>
                        </div>
                      )}
                      <div
                        className={`rounded-3 px-3 py-2 ${isOwn ? 'bg-primary text-white' : 'bg-light'}`}
                        style={{ wordBreak: 'break-word' }}
                      >
                        {msg.content}
                      </div>
                      <small className={`text-muted d-block mt-1 ${isOwn ? 'text-end' : ''}`} style={{ fontSize: 10 }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </small>
                    </div>
                  </motion.div>
                );
              })}
              {typingUsers.length > 0 && (
                <div className="text-muted small fst-italic">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="card-footer p-2">
              <form onSubmit={sendMessage} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                  maxLength={2000}
                />
                <button type="submit" className="btn btn-primary px-4" disabled={!input.trim()}>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
