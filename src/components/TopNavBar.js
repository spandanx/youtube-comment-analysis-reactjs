import React, {useState, useEffect} from 'react'

import { useNavigate, useLocation } from "react-router-dom";
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MdAccountCircle, MdContentCopy } from "react-icons/md";

import {pointerHover} from './styles/cursor.js';

const TopNavBar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [accountName, setAccountName] = useState('');
  const [accountAddress, setAccountAddress] = useState('');

  useEffect(() => {
    console.log("Calling useEffect()");
    console.log("Initial location");
    // console.log(location);
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

  return (
    <ul class="nav justify-content-between">
      <li class="nav-item">
        <a class="nav-link active">Youtube Comment Analysis</a>
        <ToastContainer/>
      </li>
      
      <li class="nav-item">
        <div class="btn-group">
          <a type="button" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <MdAccountCircle color="blue" size="2em"/>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item fw-bold">{accountName}</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item">Address: {accountAddress.substring(0, 10)}... <MdContentCopy onClick={() => {copyText(accountAddress)}} style={pointerHover}/></a>
          </div>
        </div>
      </li>
      
    </ul>
  )
}

export default TopNavBar