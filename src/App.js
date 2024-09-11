import logo from './logo.svg';
import './App.css';
import SearchScreen from './components/SearchScreen';
import TopNavBar from './components/TopNavBar';
import LeftNavBar from './components/LeftNavBar';
import Login from './components/Login/LoginPage';

import {
  BrowserRouter as Router,
  Routes ,
  Route,
} from "react-router-dom";
import RegistrationPage from './components/Login/RegisterPage';

function App() {
  return (
    <>
    <Router>
      <TopNavBar/>
      <div class="d-flex align-items-start mt-2">
        {/* <LeftNavBar/> */}
          <Routes>
            <Route path="/" element={<SearchScreen/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<RegistrationPage/>}/>
            {/* <Route path="/"/> */}
          </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
