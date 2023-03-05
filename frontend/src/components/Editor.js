import { useState, useEffect, useRef } from 'react'
import { ErrorNotification, SuccessNotification } from './Notification'
import EditorLogic from './EditorLogic'
import User from './User'
import { initSocket } from '../socket'
import {
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from 'react-router-dom'

const Editor = () => {
  const [users, setUsers] = useState([])
  /**
   * soketRef keeps track of websocket connections.
   * Returns an obj which has a key called current,
   * and it is initialised with the null value.
   */
  const socketRef = useRef(null)
  const codeRef = useRef(null)
  const location = useLocation()
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    init()
    return () => {
      socketRef.current.disconnect()
      socketRef.current.off('joined')
      socketRef.current.off('disconnected')
    }
  })

  // async / await used inplace of the axios(promise) library.  
  const init = async () => {
    // socketRef.current = await initSocket()
    socketRef.current = initSocket()

    socketRef.current.on('connect_error', error => {
      return handleErrors(error)
    })
    socketRef.current.on('connect_failed', error => {
      return handleErrors(error)
    })

    function handleErrors(error) {
      setErrorMessage('Socket connection failed, try again later')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      console.log('socket error', error)
      navigate('/')
    }

    // connect is successful, user joins room
    socketRef.current.emit('join', { 
      roomId, 
      username: location.state?.userName,
    })

    // listen to the joined message from server
    socketRef.current.on('joined', ({ users, username, socketId }) => {
      // setSuccessMessage(`${username} joined the room`)
      // setTimeout(() => {
      //   setSuccessMessage(null)
      // }, 5000)
      console.log(
        `The user ${username} with socketId (${socketId}) just joined.`
        )
      setUsers(users)
      // send sync code message to server
      socketRef.current.emit('sync-code', {
        code: codeRef.current,
        socketId,
      })
    })

    // listening for disconnection
    socketRef.current.on('disconnected', ({ socketId, username }) => {
      console.log(`The user ${username} has left the room.`)
      setUsers(prev => {
        return prev.filter(user => user.socketId !== socketId)
      })
    })
  }

  const copyRoomId = async () => {
    navigator.clipboard.writeText(roomId)
    setSuccessMessage(
      `The Room ID ${roomId} is successfully copied to the clipboard`
    )
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  function leaveRoom() {
    navigate('/')
  }

  // block illegal navigation and redirect to home
  if (!location.state) {
    return <Navigate to='/' />
  }

    
  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      <div className='editorWrapper'>
        <aside className='asideContainer'>
          <h3 className='asideOnline'>Active Users</h3>
          <hr />
          {
            <div className='clientsList'>
              {users.map(user => (
                <User key={user.socketId} username={user.username} />
          ))}
            </div>
          }
          <div className='btnGroup'>
            <button
              className='btn btnCopy'
              onClick={copyRoomId}
            >
              Copy Room ID
            </button>
            <button
              className='btn btnLeave'
              onClick={leaveRoom}
            >
              Leave
            </button>
          </div>
        </aside>
        <section className='editor-content'>
          <EditorLogic
            roomId={roomId}
            socketRef={socketRef}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </section>
      </div>
    </div>
  )
}

export default Editor