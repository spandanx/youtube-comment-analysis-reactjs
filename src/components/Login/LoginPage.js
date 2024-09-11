import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import {Link } from "react-router-dom";
import '../styles/Login.css';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };


  const registerUser = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log('Login attempted with:', { email, password });
      // Here you would typically send a request to your server
    }
  };


  return (
    <div class="form-horizontal container" role="form">          
        <div className="login-wrapper">
            <div className="login-form-container">
                <h2 className="login-title">Login</h2>
                <Form onSubmit={registerUser} className="login-form">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.email}
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