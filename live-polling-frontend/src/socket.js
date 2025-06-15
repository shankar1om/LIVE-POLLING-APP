import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Adjust if backend runs elsewhere

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket; 