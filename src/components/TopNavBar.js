import React, {useState, useEffect} from 'react'

import { useNavigate, useLocation } from "react-router-dom";
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MdAccountCircle, MdContentCopy } from "react-icons/md";

import {pointerHover} from './styles/cursor.js';

const TopNavBar = ({activeuser, setToken, setActiveUser}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [accountName, setAccountName] = useState('');
  const [accountAddress, setAccountAddress] = useState('');

  useEffect(() => {
    console.log("Calling useEffect()");
    console.log("Initial location");
    // console.log(location);
    loadSessionStorage();
  }, []);

  useEffect(()=>{
    console.log("Location pathname change Detected");
  }, [location.pathname]);


  const copyText = (text) => {
    console.log("Copied");
    navigator.clipboard.writeText(text);
    toast.info('Address Copied', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
      });
  }

  const loadSessionStorage = async () => {
    console.log("calling loadSessionStorage()");
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData == undefined || userData == null){
      console.log("userData is not present in session storage, routing to login page");
      navigate('/login');
    }
    else{
      console.log("userData is present in session storage");
      console.log(userData);
      let username = userData.activeuser;
      let token = userData.token;
      setActiveUser(username);
      setToken(token);
    }
  }

  const logout = () => {
    sessionStorage.removeItem('userData');
    setToken("");
    setActiveUser("");
    navigate('/login');
  }

  return (
    <ul class="nav justify-content-between">
      <li class="nav-item">
        <a class="nav-link">Youtube Comment Analysis</a>
        <ToastContainer/>
      </li>
      
      <li class="nav-item">
        {(activeuser != undefined && activeuser != "") && 
          <div class="btn-group">
            <a type="button" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <MdAccountCircle color="blue" size="2em"/>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item fw-bold">Hi {activeuser}</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" style = {{color: "red"}} onClick={()=>logout()}>Logout</a>
            </div>
          </div>
          }
      </li>
      
    </ul>
  )
}

export default TopNavBar