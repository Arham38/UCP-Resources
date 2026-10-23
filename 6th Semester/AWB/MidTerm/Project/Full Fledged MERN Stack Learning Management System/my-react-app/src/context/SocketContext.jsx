import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { selectToken, selectCurrentUser } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/notificationSlice';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const token = useSelector(selectToken);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  // Expose the socket instance via state so renders see the latest value
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
        setConnected(false);
      }
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    setSocketInstance(socket);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('notification', (notification) => {
      dispatch(addNotification(notification));
      toast(notification.title, {
        duration: 4000,
        style: { borderRadius: '8px', background: '#333', color: '#fff' },
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocketInstance(null);
    };
  }, [token, user, dispatch]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
