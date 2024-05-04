import logo from './logo.svg';
import './App.css';
import SearchScreen from './components/SearchScreen';
import TopNavBar from './components/TopNavBar';
import LeftNavBar from './components/LeftNavBar';

import {
  BrowserRouter as Router,
  Routes ,
  Route,
} from "react-router-dom";

function App() {
  return (
    <>
    <Router>
      <TopNavBar/>
      <div class="d-flex align-items-start mt-2">
        {/* <LeftNavBar/> */}
          <Routes>
            <Route path="/" element={<SearchScreen/>}/>
            {/* <Route path="/"/> */}
          </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
