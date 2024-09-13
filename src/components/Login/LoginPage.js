import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import {Link } from "react-router-dom";
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';


function Login({setToken, setActiveUser}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const loginPath = "http://127.0.0.1:8000/token/"

  const navigate = useNavigate();
  

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };


  const loginUser = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);

    } else {
      setErrors({});
      // console.log('Login attempted with:', { username, password });
      
      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("username", username);
      formData.append("password", password);
      
      fetch(loginPath, {
        method: 'post',
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData
       }).then(response => response.json())
       .then(data => {
          console.log("analyzed results - ");
          console.log(data);
          setToken(data);
          setActiveUser(username);
          localStorage.setItem('userData', JSON.stringify({
            "activeuser": username,
            "token": data
          }));
          navigate('/search', {token : data});
       })
       .catch(error => {
        console.log("ERROR Occurred - ");
        console.error(error);
      });
    }
  };


  return (
    <div class="form-horizontal container" role="form">          
        <div className="login-wrapper">
            <div className="login-form-container">
                <h2 className="login-title">Login</h2>
                <Form onSubmit={loginUser} className="login-form">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                    type="username"
                    placeholder="User Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>


                <Button variant="primary" type="submit" className="login-button">
                    Login
                </Button>
                <div class="d-flex justify-content-center my-3">
                    <a>Register <Link to="/register">here</Link></a>
                </div>
                </Form>
            </div>
        </div>
      </div>
  );
}


export default Login;