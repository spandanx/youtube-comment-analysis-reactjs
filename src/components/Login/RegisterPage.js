import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import {Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import {registerUrl} from '../Common/CommonFunctions';


function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [refferalCode, setRefferalCode] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!verifyPassword) newErrors.verifyPassword = 'Please verify the password';
    else if (verifyPassword.length > 0 && verifyPassword != password) newErrors.verifyPassword = 'Passwords are not matching!';
    if (!fullname) newErrors.fullname = 'Full name is required';
    if (!refferalCode) newErrors.refferalCode = 'Referral Code is required';
    return newErrors;
  };


  const registerUser = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    let isError = false;
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log("Working on Registration!");
      fetch(registerUrl, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "username": username,
          "email": email,
          "full_name": fullname,
          "password": password,
          "disabled": false,
          "referral_code": refferalCode
        })
       }).then(response => {
          console.log("Status", response.ok);
          if (!response.ok){
            isError = true;
          }
          return response.json();
        })
       .then(data => {
          console.log("Registration Info - ");
          console.log(data);
          if (isError){
            console.log("Error present");
            let temp_errors = {};
            temp_errors.exception = "Some errors have occurred";
            if ("detail" in data){
              temp_errors.exception = data.detail;
              
            }
            setErrors(temp_errors);
          }
          else{
            console.log("Success");
            navigate('/login');
          }
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
                <h2 className="login-title">Register</h2>
                <Form onSubmit={registerUser} className="login-form">
                <Form.Group className="mb-3" controlId="formBasicUserName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                    type="fullname"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    isInvalid={!!errors.fullname}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUserName">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                    type="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>
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

                <Form.Group className="mb-3" controlId="formBasicVerifyPassword">
                    <Form.Label>Verify Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Verify Password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    isInvalid={!!errors.verifyPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.verifyPassword}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicReferralCode">
                    <Form.Label>Referral Code</Form.Label>
                    <Form.Control
                    type="referralcode"
                    placeholder="Referral Code"
                    value={refferalCode}
                    onChange={(e) => setRefferalCode(e.target.value)}
                    isInvalid={!!errors.refferalCode}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.refferalCode}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="login-button">
                    Register
                </Button>
                <div class="d-flex justify-content-center my-3">
                    <a style={{color: "red"}}>{errors?.exception}</a>
                </div>
                <div class="d-flex justify-content-center my-3">
                    <a>Login <Link to="/login">here</Link></a>
                </div>
                </Form>
            </div>
        </div>
      </div>
  );
}


export default RegistrationPage;