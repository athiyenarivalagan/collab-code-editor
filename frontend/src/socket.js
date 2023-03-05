import { io } from 'socket.io-client'

export const initSocket = async () => {
  const options = {
    // forceNew: true,
    'force new connection': true,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    transports: ['websocket', 'polling'],
  }
  return io('http://localhost:3001', options)
}