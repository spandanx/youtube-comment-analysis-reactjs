import logo from './logo.svg';
import './App.css';
import SearchScreen from './components/SearchScreen';
import TopNavBar from './components/TopNavBar';
import LeftNavBar from './components/LeftNavBar';
import Login from './components/Login/LoginPage';
import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Routes ,
  Route,
} from "react-router-dom";
import RegistrationPage from './components/Login/RegisterPage';





function App() {

  const [authToken, setAuthToken] = useState('');
  const [activeUser, setActiveUser] = useState('');

  const setToken = (token) => {
    console.log("Setting Token", token);
    setAuthToken(token);
  }

  return (
    <>
    <Router>
      <TopNavBar activeUser={activeUser} setToken={setToken} setActiveUser={setActiveUser}/>
      <div class="d-flex align-items-start mt-2">
        {/* <LeftNavBar/> */}
          <Routes>
            <Route path="/" element={<Login setToken={setToken} setActiveUser={setActiveUser}/>}/>
            <Route path="/search" element={<SearchScreen setToken={setToken} setActiveUser={setActiveUser} token={authToken}/>}/>
            <Route path="/login" element={<Login setToken={setToken} setActiveUser={setActiveUser}/>}/>
            <Route path="/register" element={<RegistrationPage/>}/>
            {/* <Route path="/"/> */}
          </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
