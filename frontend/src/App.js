import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Editor from './components/Editor'

const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/editor/:roomId' element={<Editor />} />
        </Routes>
      </Router>
    </>
  )
}


export default App
