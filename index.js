const express = require('express')
const app = express()
const { createServer } = require('http')
const { Server } = require('socket.io')
const httpServer = createServer(app)
const cors = require('cors')
// init new socket.io instance and pass the http server to it
const io = new Server(httpServer)
require('dotenv').config()

/* middleware */
app.use(cors())

/**
 * create a hashmap
 * save login user with their respective socketId
 */
const userSocketMap = {}
function getAllActiveUsers(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    socketId => {
      return {
        socketId,
        username: userSocketMap[socketId],
      }
    },
  )
}

// connect event
io.on('connection', socket => {
  console.log('A new web connection is established!')
  socket.on('join', ({ roomId, username }) => {
    console.log('socketId in the server: ', socket.id)
    userSocketMap[socket.id] = username
    socket.join(roomId)
    // get current users
    const users = getAllActiveUsers(roomId)
    users.forEach(({ socketId }) => {
      // return joined message to each user
      io.to(socketId).emit('joined', {
        users,
        username,
        socketId: socket.id,
      })
    })
  })

  socket.on('code-change', ({ roomId, code }) => {
    socket.in(roomId).emit('code-change', { code })
  })

  socket.on('sync-code', ({ socketId, code }) => {
    io.to(socketId).emit('code-change', { code })
  })

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms]
    rooms.forEach(roomId => {
      socket.in(roomId).emit('disconnected', {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      })
    })
    delete userSocketMap[socket.id]
    socket.leave()
  })
})


const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})