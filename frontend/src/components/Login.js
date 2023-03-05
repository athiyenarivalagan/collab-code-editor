import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { ErrorNotification, SuccessNotification } from './Notification'
import Footer from './Footer'


const Login = () => {
    const [userName, setUserName] = useState('')
    const [roomId, setRoomId] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const navigate = useNavigate()  

    const generateUniqueId = () => {
      const generateRoomId = uuidv4()
      if (generateRoomId) {
        setRoomId(generateRoomId)
        setSuccessMessage(
          `The Room ID ${generateRoomId} is successfully generated and 
          copied to the Room ID input of form`
          )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }
      else {
        setErrorMessage('The Room Id generation is unsuccessful')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
 
    const joinRoom = (event) => {
      // check if username already exists for the given Room ID ?
        if (roomId && userName) {
          // event.preventDefault() // prevents reloading
          // redirect to editor page
          navigate(`/editor/${roomId}`, {
            state: {
              userName,
            },
          })
        setUserName('')
        setRoomId('') 
      }
    }

    // event handlers
    const handleIdChange = event => setRoomId(event.target.value)
    const handleNameChange = event => setUserName(event.target.value)


    return (
      <>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      <article className='homeWrapper'>
        <section className='formWrapper'>
          <div className='formTitle'>
            <h1>Collaborative Code Space</h1>
          </div>
          <div className='inputContainer'>
            <p className='fontStyle'>Username or email</p>
            <input
              type='text'
              placeholder='ada lovelace'
              className='inputBox'
              value={userName}
              onChange={handleNameChange} />
              <p className='fontStyle'>Room ID</p>
            <input
              type='text'
              className='inputBox'
              value={roomId}
              onChange={handleIdChange} />
              <br />
            <button
              className='btn btnJoin'
              onClick={joinRoom}
              >
                Join
            </button>
            <br />
            <hr />
            <div className='createInfo'>
              Click here to generate a new Room ID &nbsp;
              <span onClick={generateUniqueId} className='createNewRoom'>
                click
              </span>
            </div>
          </div>
        </section>
        <Footer />
      </article>
    </>
  )
}

export default Login