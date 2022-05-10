import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Join from './components/Join';
import './App.css'
import Header from './components/Header';

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' exact element={<Chat />} />
          <Route path='/join' element={<Join />} />
        </Routes>
      </Router>
    </>
  )
}

export default App