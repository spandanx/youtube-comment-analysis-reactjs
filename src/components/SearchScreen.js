// import React, {useState, useEffect} from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { TiTick } from "react-icons/ti";
import { BsExclamation } from "react-icons/bs";
import { TbMessageQuestion } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from "react-router-dom";
// import { BallTriangle } from 'react-loader-spinner';
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
import { LuCheckCircle } from "react-icons/lu";
import { RiSettings4Fill } from "react-icons/ri";
import { MdNavigateNext, MdNavigateBefore, MdRefresh } from "react-icons/md";
// import { BiErrorCircle } from "react-icons/bi";
import ReactPaginate from 'react-paginate';
// import Select from 'react-select'
// import { IoWarningSharp } from "react-icons/io5";
// import { Bars } from 'react-loading-icons'
import { BiError } from "react-icons/bi";
// import {Animation, Button} from 'rsuite';
import './SearchScreen.css';
import './styles/ExtractionLoading.css';
import './styles/LoadingModel.css';
import './styles/LoadingQAModel.css';
// import './styles/ModelSelection.css';
import './styles/SummaryModelSelection.css';
import './styles/videopagination.css';

// import CryptoJS from "crypto-js";
import {encryptData, decryptData, loginUrl, videoSearchUrl, videoSearchByTokenUrl, commentAnalysisUrl, extractCommentUrl, 
  questionAnsweringUrl, getSummaryModelListUrl, getQAModelListUrl, healthCheckUrl} from './Common/CommonFunctions';
import {Link } from "react-router-dom";

// import {generateTokenAndLogin} from './Login/LoginPage'
// import './styles/SummaryNestedModelSelection.css';

// import {
//   Container,
//   ListGroup,
//   Button,
// } from 'react-bootstrap';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

const SearchScreen = ({token, setToken, setActiveUser}) => {

  // const navigate = useNavigate();


    const [searchText, setSearchText] = useState('');
    const [videoArray, setVideoArray] = useState([]);
    const [videoSelectMap, setVideoSelectMap] = useState({});
    const [videoSelectMapLength, setVideoSelectMapLength] = useState(0);
    const [videoSearchError, setVideoSearchError] = useState("");
    const [commentData, setCommentData] = useState({});

    const [extractionLoading, setExtractionLoading] = useState(false);
    const [extractionAnalysisLoading, setExtractionAnalysisLoading] = useState(false);
    const [toggleExtractionList, setToggleExtractionList] = useState(false);
    const [textExtractionisError, setTextExtractionisError] = useState("");

    const [QAExtractionList, setQAExtractionList] = useState(false);
    // const [QAisError, setQAisError] = useState("");
    const [QAAnalysis, setQAAnalysis] = useState({});

    const [summarizationLoading, setSummarizationLoading] = useState(false);
    const [QALoading, setQALoading] = useState(false);
    const [toggleAnalysisList, setToggleAnalysisList] = useState(false);
    const [videoAnalysis, setVideoAnalysis] = useState({});
    const [videoAnalysisError, setVideoAnalysisError] = useState("");

    const [authToken, setAuthToken] = useState("");
    
//######################
    

    const [inProp, setInProp] = useState(false);
    const nodeRef = useRef(null);

    const [anim, setAnim] = useState(false);
    const [toggleVideoList, setToggleVideoList] = useState(false);

    const firstTimeSearchDelay = 500; //ms

    const [selectedSummaryModel, setSelectedSummaryModel] = useState("Abstractive - BARTAbstractiveSummarizer");

    const [selectedQAModel, setSelectedQAModel] = useState("DistilbertQuestionAnswering");

    const [fullVideoObject, setFullVideoObject] = useState({});

    const [summaryModels, setSummaryModels] = useState([]);

    const [qaModels, setQAModels] = useState([]);


    const accountTypes = ["EMPLOYEE", "DEPARTMENT", "AUDITOR"];

    const [tokenExpired, setTokenExpired] = useState(false);

    useEffect(() => {
      initializeMLModels();
    }, []);

    useEffect(() => {
      setAuthToken(token);
      console.log("token changed", token);
    }, [token]);


    const getToast = (msg, type) => {
      let structure = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined
      };
      if (type=="ERROR"){
        return toast.error(msg, structure);
      }
      if (type=="SUCCESS"){
        return toast.success(msg, structure);
      }
      return toast.info(msg, structure);
    }

  const initializeMLModels = async () => {
    getQAModels();
    getSummaryModels();
  }

  const generateNewToken = async (username, password) => {

      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("username", username);
      formData.append("password", password);
      console.log("Called generateNewToken()");

      let newToken = {};

      await fetch(loginUrl, {
        method: 'post',
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData
       }).then(response => response.json())
       .then(data => {
          console.log("New Token");
          console.log(data);
          newToken = data;
          setToken(data);
          setActiveUser(username);
          
          let toStore = {
            "activeuser": username,
            "token": data,
            "password": encryptData(password)
          };
          sessionStorage.setItem('userData', JSON.stringify(toStore));
          // navigate('/search', {token : data});
       })
       .catch(error => {
        console.log("ERROR Occurred - ");
        console.error(error);
      });
      return newToken;
  }

  const checkAndUpdateToken = async () => {
    console.log("Calling healthCheck");
    let fetchNewTokenFlag = false;
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    let username = userData.activeuser;
    let password = userData.password;
    // console.log(userData);
    await fetch(healthCheckUrl,
      {
        method: 'get',
        headers: {
          'Content-Type':'application/json',
          'Authorization': token.token_type + " " + token.access_token
        }
      }
    )
    .then(response => {
      // console.log(response.status);
      // console.log("response.headers");
      // console.log(...response.headers);
      // console.log(response.headers.has('reason'));
      // console.log(response.status == "403");
      // console.log(response.headers.get('reason') == "TOKEN_EXPIRED");
      if (response.status == "403" && response.headers.has('reason') && response.headers.get('reason') == "TOKEN_EXPIRED"){
        console.log("Need to fetch token");
        if (password == undefined || password == null){
          console.log("Keep me signed in was not enabled, navigating to login screen");
          setTokenExpired(true);
        }
        else {
          console.log("Going to fetch new token");
          fetchNewTokenFlag = true;
        }
        // generateTokenAndLogin();
      }

      // response.headers.forEach((value, key) => console.log("header:", key, 'value:', value));
      return response.json()})
    .then(data => {
      console.log("HealthCheck data");
      console.log(data);
    })
    .catch(error => {
      console.log("ERROR - HealthCheck failed");
      console.log(error);
  });

  //########################## Fetch New Token Code
  console.log(fetchNewTokenFlag);
  let workingToken = token;
  if (fetchNewTokenFlag){
      console.log("fetching new token");
      let decryptedPassword = decryptData(password);
      workingToken = await generateNewToken(username, decryptedPassword);
    }
    return workingToken;
  }

  const getSearchResults = async (event) => {
    event.preventDefault();
    setToggleVideoList(false);
    console.log("querying - " + searchText);
    var queryUrl = videoSearchUrl + "?searchText=" + searchText + "&max_results="+"10"
    console.log("url - ");
    console.log(queryUrl);

    let workingToken = await checkAndUpdateToken();
    console.log("workingToken");
    console.log(workingToken);
    

    await fetch(queryUrl,
      {
        method: 'get',
        headers: {
          'Content-Type':'application/json',
          'Authorization': workingToken.token_type + " " + workingToken.access_token
        }
      }
    )
        .then(response => {
          console.log("response.status");
          console.log(response.status);
          console.log("response.headers");
          console.log(...response.headers);
          console.log(response.headers.has('reason'));
          // response.headers.forEach((value, key) => console.log("header:", key, 'value:', value));
          return response.json()})
        .then(data => {
          console.log(data);
          setVideoSearchError("");
          let firstTimeLoad = false;
          // console.log(videoArray);
          // console.log(videoArray == null);
          // console.log(videoArray.length);
          if ((videoArray == null) || videoArray.length == 0){
            firstTimeLoad = true;
          }
          setVideoArray(data["videos"]);
          setFullVideoObject(data);
          if (firstTimeLoad) {
            setTimeout(() => {
              setToggleVideoList(true);
          }, firstTimeSearchDelay);
          }
          else{
            setToggleVideoList(true);
          }

          console.log("data - ");
          console.log(data);
        })
        .catch(error => {
          console.log("ERROR ");
          console.log(error);
          setVideoSearchError("Sorry! Could not process the search request!");
      });
  }

  const getSearchResultsByPageToken = async (pageToken) => {
    // event.preventDefault();
    setToggleVideoList(false);
    console.log("querying - " + searchText);
    var queryUrl = videoSearchByTokenUrl + "?searchText=" + searchText + "&pageToken=" + pageToken + "&max_results=10"
    console.log("url - ");
    console.log(queryUrl);

    let workingToken = await checkAndUpdateToken();
    console.log("workingToken");
    console.log(workingToken);

    fetch(queryUrl,
      {
        method: 'get',
        headers: {
          'Content-Type':'application/json',
          'Authorization': workingToken.token_type + " " + workingToken.access_token
        }
      }
    )
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setVideoSearchError("");
          let firstTimeLoad = false;
          // console.log(videoArray);
          // console.log(videoArray == null);
          // console.log(videoArray.length);
          if ((videoArray == null) || videoArray.length == 0){
            firstTimeLoad = true;
          }
          setVideoArray(data["videos"]);
          setFullVideoObject(data);
          if (firstTimeLoad) {
            setTimeout(() => {
              setToggleVideoList(true);
          }, firstTimeSearchDelay);
          }
          else{
            setToggleVideoList(true);
          }

          console.log("data - ");
          console.log(data);
        })
        .catch(error => {
          console.log("ERROR ");
          console.log(error);
          setVideoSearchError("Sorry! Could not process the search request!");
      });
  }

  const getSummaryModels = async() => {

    let workingToken = await checkAndUpdateToken();
    console.log("workingToken");
    console.log(workingToken);


    fetch(getSummaryModelListUrl, {
      method: 'get',
      headers: {
          'Content-Type':'application/json',
          'Authorization': workingToken.token_type + " " + workingToken.access_token
        }
     }).then(response => response.json())
     .then(data => {
        console.log("Summary Models - ");
        console.log(typeof data);
        console.log(data);
        setSummaryModels(data);
     })
     .catch(error => {
      console.log("ERROR Occurred - ");
      console.error(error);
      console.log("Error! Could not get the summary models!");
    });
  }

  const getQAModels = async () => {

    let workingToken = await checkAndUpdateToken();
    console.log("workingToken");
    console.log(workingToken);

    fetch(getQAModelListUrl, {
      method: 'get',
      headers: {
        'Content-Type':'application/json',
        'Authorization': workingToken.token_type + " " + workingToken.access_token
        }
     }).then(response => response.json())
     .then(data => {
        console.log("QA Models - ");
        // console.log(typeof(data));
        // console.log(Object.prototype.toString.call({}));
        // console.log(Object.prototype.toString.call([]))
        // console.log(data);
        console.log("Conditions");
        // console.log(data!=undefined);
        // console.log(data!=null);
        // console.log(Object.prototype.toString.call(data));
        // console.log(Object.prototype.toString.call(data) == '[object Array]');
        // console.log((data!=undefined || data!=null || Object.prototype.toString.call(data) == '[object Array]'));
        setQAModels(data);
     })
     .catch(error => {
      console.log("ERROR Occurred - ");
      console.error(error);
      console.log("Error! Could not get the QA models!");
    });
  }

  const extractVideoText = async (event) => {
    event.preventDefault();
    setExtractionLoading(true);
    // setToggleExtractionList(false);
    setTextExtractionisError("");
    console.log("analyzing - " + searchText);
    // var queryUrl = commentAnalysisUrl;
    console.log({
      "ids": Object.keys(videoSelectMap)
     });
    //  console.log();

    let workingToken = await checkAndUpdateToken();
    console.log("workingToken");
    console.log(workingToken);
     
    fetch(extractCommentUrl, {
      method: 'post',
      headers: {
        'Content-Type':'application/json',
        'Authorization': workingToken.token_type + " " + workingToken.access_token
      },
      body: JSON.stringify({
        "ids": Object.keys(videoSelectMap)
       })
     }).then(response => response.json())
     .then(data => {
        // console.log("Printing Status Response");
        // console.log(data.status);
        // console.log(!data.ok);
        console.log("analyzed results - ");
        console.log(data);
        setExtractionLoading(false);
        // setToggleExtractionList(true);
        // setVideoAnalysis(data);
        setCommentData(data);
        if ('detail' in data){
          setTextExtractionisError(data["detail"]);
        }
        else{
          setTextExtractionisError("");
        }
     })
     .catch(error => {
        // console.log("Printing Status - ERROR");
        // console.log(error.status);
        // console.log(!error.ok);
      console.log("ERROR Occurred - ");
      console.error(error);
      setExtractionLoading(false);
      setTextExtractionisError("Error! Could not process the text extraction request!");
      // console.log(Object.keys(videoAnalysis).length);
      // console.log(isNaN(videoAnalysis.question));
      // console.log(videoAnalysis.questions?.length);
    });
  }
  const analyzeVideoInformation = (event) => {
    event.preventDefault();
    getSummaryInformation();
    getQuestionAnswer();
  }

  const getSummaryInformation = async (event) => {
    // event.preventDefault();
    setSummarizationLoading(true);
    setExtractionAnalysisLoading(false);
    setToggleExtractionList(false);
    setVideoAnalysisError("");
    setVideoAnalysis({});
    console.log("analyzing - " + searchText);
    // var queryUrl = commentAnalysisUrl;
    console.log({
      "texts": commentData.statements,
      "summModel": "Abstractive - BARTAbstractiveSummarizer"
     });
    //  console.log();

    let workingToken = await checkAndUpdateToken();
    console.log("workingToken");
    console.log(workingToken);
     
    fetch(commentAnalysisUrl, {
      method: 'post',
      headers: {
        'Content-Type':'application/json',
        'Authorization': workingToken.token_type + " " + workingToken.access_token
      },
      body: JSON.stringify({
        "texts": commentData.statements,
        "summModel": "Abstractive - BARTAbstractiveSummarizer"
       })
     }).then(response => response.json())
     .then(data => {
        // console.log("Printing Status Response");
        // console.log(data.status);
        // console.log(!data.ok);
       console.log("analyzed results - ");
       console.log(data);
      //  if (!isNaN(data.summary)){
        setSummarizationLoading(false);
        // setToggleAnalysisList(true);
        setExtractionAnalysisLoading(true);
        setToggleExtractionList(true);
        // setToggleExtractionList(true);
        setVideoAnalysis(data);

        setVideoAnalysisError("");
     })
     .catch(error => {
      console.log("ERROR Occurred - ");
      console.error(error);
      setSummarizationLoading(false);
      setToggleExtractionList(false);
      setExtractionAnalysisLoading(false);
      setVideoAnalysisError("Error! Could not process the analysis request!");
    });
  }

  const getQuestionAnswer = async (event) => {
    // event.preventDefault();
    setQALoading(true);
    // setQAExtractionList(false);
    // setToggleAnalysisList(false);
    setExtractionAnalysisLoading(false);
    setToggleExtractionList(false);
    setVideoAnalysisError("");
    setQAAnalysis({});
    console.log("analyzing - " + searchText);
    // var queryUrl = commentAnalysisUrl;
    console.log({
      "context": commentData.statements,
      "questions": commentData.questions,
      "qaModel": "DistilbertQuestionAnswering"
     });
    //  console.log();
    let workingToken = await checkAndUpdateToken();
    console.log("workingToken");
    console.log(workingToken);
     
    fetch(questionAnsweringUrl, {
      method: 'post',
      headers: {
        'Content-Type':'application/json',
        'Authorization': workingToken.token_type + " " + workingToken.access_token
      },
      body: JSON.stringify({
        "context": commentData.statements,
        "questions": commentData.questions,
        "qaModel": "DistilbertQuestionAnswering"
       })
     }).then(response => response.json())
     .then(data => {
        // console.log("Printing Status Response");
        // console.log(data.status);
        // console.log(!data.ok);
       console.log("analyzed results - ");
       console.log(data);
       console.log(isNaN(data.question));
      //  if (!isNaN(data.question)){
        setQALoading(false);
        // setQAExtractionList(true);
        // setToggleAnalysisList(true);
        setToggleExtractionList(true);
        setExtractionAnalysisLoading(true);
        setQAAnalysis({"questions" : data});
        setVideoAnalysisError("");
        console.log("Object.keys(QAAnalysis).length");
        console.log(Object.keys(QAAnalysis).length);
        // console.log("QAAnalysis.questions.length");
        // console.log(QAAnalysis.questions.length);
     })
     .catch(error => {
      console.log("ERROR Occurred - ");
      console.error(error);
      setQALoading(false);
      setExtractionAnalysisLoading(false);
      setToggleExtractionList(false);
      setVideoAnalysisError("Error! Could not process the analysis request!");
      console.log(Object.keys(videoAnalysis).length);
      console.log(isNaN(videoAnalysis.question));
      console.log(videoAnalysis.questions?.length);
    });
  }

  const updateVideoMap = (videoId) => {
    // event.preventDefault();
    console.log("Updating - " + videoId);
    let localVideoMap = videoSelectMap;
    if (videoId in localVideoMap){
      delete localVideoMap[videoId];
    }
    else{
      localVideoMap[videoId] = "true";
    }
    setVideoSelectMapLength(Object.keys(videoSelectMap).length);
    setVideoSelectMap(localVideoMap);
    console.log(localVideoMap);

  }

  const updateVideoMapAll = (videoArray) => {
    // event.preventDefault();
    console.log("calling updateVideoMapAll()");
    let localVideoMap = videoSelectMap;
    videoArray.map((videoItem)=>{
      let videoId = videoItem.videoId;
      if (videoId in localVideoMap){
        delete localVideoMap[videoId];
      }
      else{
        localVideoMap[videoId] = "true";
      }
    }
    );
    console.log(localVideoMap);
    setVideoSelectMapLength(Object.keys(videoSelectMap).length);
    setVideoSelectMap(localVideoMap);
  }

  const displayAnimation = (event) => {
    event.preventDefault();
    setToggleVideoList(!toggleVideoList); 
  }

const getExtractionLoadingAnimation = () => {
  return (
  <form class="form-horizontal container" role="form">
    <div class="form-group row my-3 justify-content-center">
      <div class="col-sm-auto">
      </div>
      <div class="col-sm-auto">
        <div class="extraction-loader"></div>
          </div>
        <div class="col-sm-auto">
      </div>
    </div>
  </form>
  );
}

const getSummarizationLoadingAnimation = () => {
  return (
  <form class="form-horizontal container" role="form">
    <div class="form-group row my-3 justify-content-center">
      <div class="col-sm-auto">
      </div>
      <div class="col-sm-auto">
        <div class="summary-analysis-loader"></div>
          </div>
        <div class="col-sm-auto">
      </div>
    </div>
  </form>
  );
}

const getQALoadingAnimation = () => {
  return (
  <form class="form-horizontal container" role="form">
    <div class="form-group row my-3 justify-content-center">
      <div class="col-sm-auto">
      </div>
      <div class="col-sm-auto">
        <div class="qa-analysis-loader"></div>
          </div>
        <div class="col-sm-auto">
      </div>
    </div>
  </form>
  );
}

const getWarningMessage = (message) => {
  return (
  <form class="form-horizontal container" role="form">
    <div class="form-group row mx-3 justify-content-center" style={{color:"black"}}>
    </div>
    <div class="form-group row my-3 justify-content-center" style={{color:"black"}}>
        <div class="col-sm-auto">
        </div>
        <div class="col-sm-auto">
          {message}
          </div>
        <div class="col-sm-auto">
      </div>
    </div>
  </form>
  );
}

const getDownArrowVideoList = () => {
  return (
  <form class="form-horizontal container" role="form">
    <div class="form-group row my-3 justify-content-between">
      <div class="col-sm-5">
      </div>
      <div class="col-sm-auto downarray">
        {toggleVideoList ? 
          <FaAnglesUp onClick={() => setToggleVideoList(!toggleVideoList)}/>
          :
          <FaAnglesDown onClick={() => setToggleVideoList(!toggleVideoList)}/>
        }
          </div>
        <div class="col-sm-5">
      </div>
    </div>
  </form>
  );
}

const getDownArrowAnalysisList = () => {
  return (
  <form class="form-horizontal container" role="form">
    <div class="form-group row my-3 justify-content-between">
      <div class="col-sm-5">
      </div>
      <div class="col-sm-auto downarray">
        {toggleExtractionList ? 
          <FaAnglesUp onClick={() => setToggleExtractionList(!toggleExtractionList)}/>
          :
          <FaAnglesDown onClick={() => setToggleExtractionList(!toggleExtractionList)}/>
        }
          </div>
        <div class="col-sm-5">
      </div>
    </div>
  </form>
  );
}


const sampleDisplayButton = (event) => {
  event.preventDefault();
  setInProp(!inProp);
}

const getSampleTransition = () => {
  return (
    <div>
        {/* <CSSTransition nodeRef={nodeRef} in={inProp} timeout={2000} classNames="my-node"> */}
        <CSSTransition in={inProp} timeout={2000} classNames="my-node">
          {/* <div ref={nodeRef}> */}
            <p>Hey there</p>
          {/* </div> */}
        </CSSTransition>
        <button type="button" onClick={(event) => sampleDisplayButton(event)}>
          Click to Show
        </button>
      </div>
  )
}

const getVideoListPagination = (prevToken, nextToken) => {
  return (
    <form class="form-horizontal container" role="form">
      <div class="form-group row">
        <div class="col-sm-10"></div>
        {prevToken != null ? 
          <div class="col-sm-1" style={{cursor: 'pointer'}} onClick={()=>getSearchResultsByPageToken(prevToken)}>
              <MdNavigateBefore/>Previous
          </div>
         : 
          <div class="col-sm-1"></div>
        }
        {nextToken != null ? 
          <div class="col-sm-1" style={{cursor: 'pointer'}} onClick={()=>getSearchResultsByPageToken(nextToken)}>
            Next<MdNavigateNext/>
          </div>
        :
          <div class="col-sm-1"></div>
        }
      </div>
    </form>
      
  );
}

const checkIfAllSelected = () => {
  for (let i = 0; i < videoArray.length; i++) {
    if (!(videoArray[i].videoId in videoSelectMap))
      return false;
  }
  // videoArray.forEach(function(vidItem) {
  //     if (!(vidItem.videoId in videoSelectMap))
  //       return false;
  //   }
  // )
  if (videoArray.length==0)
    return false;
  return true;
}

const getVideoList = () => {
  return (
  // <CSSTransition in={anim} timeout={2000} classNames="videoitem">
    // <div class={`videocustom ${toggle ? 'show' : ''}`}>
    <div class={`videocustom ${toggleVideoList ? 'show' : ''}`} style={{"overflow-y": "scroll"}}>
      <input value = "test" class = "align-items-stretch" type = "checkbox" checked={checkIfAllSelected()} onChange = {(event) => updateVideoMapAll(videoArray)}/>
      {/*   */}
      {getVideoListPagination(fullVideoObject["prevPageToken"], fullVideoObject["nextPageToken"])}
      <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
      {videoArray.map((videoItem)=>(

      <div class="d-flex align-items-center">
        <div class="p-2 bd-highlight">
          <input value = "test" class = "align-items-stretch" type = "checkbox" checked={videoItem.videoId in videoSelectMap} onChange = {(event) => {updateVideoMap(videoItem.videoId)}} />
        </div>
        <div class="p-2 bd-highlight">
          <img src={videoItem.thumbnails} />
        </div>
        <div class="p-2 bd-highlight">
          <a class="nav-link">{videoItem.title}</a>
        </div>
      </div>
      ))}
      <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
      {getVideoListPagination(fullVideoObject["prevPageToken"], fullVideoObject["nextPageToken"])}
      <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
    </div>
    // </CSSTransition>
  )
}

const getAnalysisForm = () => {
  return (
    <div class="form-group row my-3 py-3 justify-content-center">
        <div class="d-flex align-items-center">
            <div class="col-sm-auto">
                <button disabled={videoSelectMapLength==0 || extractionLoading} class="btn btn-primary mx-1" onClick={(event) => extractVideoText(event)}>Extract Text</button>
            </div>
            {/* <div class="col-sm-1">
            </div> */}
            <div class="col-sm-auto">
                <button disabled={Object.keys(commentData).length == 0 || summarizationLoading || QALoading} class="btn btn-primary mx-1" onClick={(event) => analyzeVideoInformation(event)}>Get Analysis</button>
            </div>
        </div>
        <div class="d-flex align-items-center" style={{"transition-delay": "250ms"}}>
            {extractionLoading &&  
              getExtractionLoadingAnimation()
            }
            {Object.keys(commentData).length > 0 && (!extractionLoading) && (textExtractionisError == "") &&
                <p class="my-auto">Extracted information<LuCheckCircle style={{ color: "green"}}/></p>
            }
        </div>
        <div class="d-flex align-items-center">
            {
              QALoading && 
              getQALoadingAnimation()
            }
            {
              Object.keys(QAAnalysis).length>0 && (!QALoading) && 
              <p class="my-auto">Generated questions and answers <LuCheckCircle style={{ color: "green"}}/></p>
            }
        </div>
        <div class="d-flex align-items-center">
            {
              summarizationLoading && 
              getSummarizationLoadingAnimation()
            }
            {
              Object.keys(videoAnalysis).length>0 && (!summarizationLoading) && 
              <p class="my-auto">Generated summary <LuCheckCircle style={{ color: "green"}}/></p>
            }
        </div>
        <div class="d-flex align-items-center">
            {textExtractionisError.length > 0 && 
              getWarningMessage(textExtractionisError)
            }
        </div>
        {Object.keys(videoAnalysis).length>0 &&
          <div>
            <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
            <div class="text-center"><strong>SUMMARY</strong></div>
            <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }}/>
            {getDownArrowAnalysisList()}
        </div>
        }
        <div class={`analysis-list ${toggleExtractionList ? 'show' : ''}`} style={{"overflow-y": "scroll"}}>
        {/* <div class={`analysis-list show`} style={{"overflow-y": "scroll"}}> */}
            {(Object.keys(videoAnalysis).length>0 && videoAnalysis.summary!=undefined && videoAnalysis.summary!=null && Object.prototype.toString.call(videoAnalysis.summary) == '[object Array]') ?
            <div class="col">
                {videoAnalysis.summary.map((summary_text)=>(
                  <div class="text-left">
                    <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
                    {summary_text}
                    </div>
                  
                  )
                )}
            </div>
            :
            <></>
            }
            <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
            <div class="col">
              {(Object.keys(QAAnalysis).length>0 && QAAnalysis.questions.length>0) ?
                <div class="text-center"><strong>QUESTIONS</strong></div>
              :
                <div></div>
              }
          </div>

          {(Object.keys(QAAnalysis).length>0 && QAAnalysis.questions.length>0) ? QAAnalysis.questions.map((question)=>(
            <div class="p-flex">
              <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }}/>
              <div class="d-flex align-items-center">
                <TbMessageQuestion color="red"/>
                <a class="nav-link h5">{question.question}</a>
              </div>
              <div class="d-flex align-items-center">
                <div class="p-2 bd-highlight mx-4">
                  <a>{question.answer.answer}</a>
                </div>
              </div>
          </div>
          ))
          :
          <></> }
        </div>
      </div>
  )
}

const getVideoListForm = () => {
  return (
    <div>
          {videoSearchError!=null && videoSearchError.length > 0 && 
            getWarningMessage(videoSearchError)
          }
          {(videoArray!= null && videoArray.length > 0) || (fullVideoObject["nextPageToken"] != null) ? 
            <div class="col">
                <div class="text-center"><strong>VIDEOS</strong></div>
              <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
              {getDownArrowVideoList()}
              {toggleVideoList ? 
                <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
              :
                <></>
              }
            </div>
          :
          <div></div>
        }
        {(videoArray!= null && videoArray.length > 0) || (fullVideoObject["nextPageToken"] != null) ? 
          getVideoList()
        :
        <div></div>
        }
      </div>
  )
}


const getSettingDropDown = () => {
  return (
    <div class="dropdown">
      <a data-mdb-button-init
        data-mdb-ripple-init data-mdb-dropdown-init class="btn dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-mdb-toggle="dropdown"
        aria-expanded="false">
        <RiSettings4Fill style={{ color: "black"}}/>
      </a>

      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item">Select Summary Model <MdRefresh style={{ color: "black"}} onClick={()=>initializeMLModels()}/></a></li>
        <li>
          <div class="dropdown mx-3">
            <button data-mdb-button-init
              data-mdb-ripple-init data-mdb-dropdown-init class="btn dropdown-toggle"
              type="button"
              id="dropdownMenuSummaryButton"
              data-mdb-toggle="dropdown"
              aria-expanded="false"
            >{selectedSummaryModel}</button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuSummaryButton">
                {(summaryModels!=undefined && summaryModels!=null && Object.prototype.toString.call(summaryModels) == '[object Array]') ? summaryModels.map((summaryModel) => 
                <li><a class="dropdown-item" style={{"backgroundColor": summaryModel==selectedSummaryModel ? "green":""}} onClick={()=>setSelectedSummaryModel(summaryModel)}>{summaryModel}</a></li>
                ) : <></>}
            </ul>
          </div>
        </li>
        <div class="dropdown-divider"></div>
        <li><a class="dropdown-item">Select Question Answer Model</a></li>
        <li>
          <div class="dropdown mx-3">
            <button data-mdb-button-init
              data-mdb-ripple-init data-mdb-dropdown-init class="btn dropdown-toggle"
              type="button"
              id="dropdownMenuQAButton"
              data-mdb-toggle="dropdown"
              aria-expanded="false"
            >{selectedQAModel}</button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuQAButton">
                {(qaModels!=undefined && qaModels!=null && Object.prototype.toString.call(qaModels) == '[object Array]') ? qaModels.map((qaModel) => 
                <li><a class="dropdown-item" style={{"backgroundColor": qaModel==selectedQAModel ? "green":""}} onClick={()=>setSelectedQAModel(qaModel)}>{qaModel}</a></li>
                ) : <></>}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  )
}


const getNestedSettingDropDown = () => {
  return (
    <div class="dropdown">
      <button data-mdb-button-init data-mdb-ripple-init data-mdb-dropdown-init
        class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton"
        data-mdb-toggle="dropdown" aria-expanded="false">
        Dropdown button
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li>
          <a class="dropdown-item" href="#">Another action</a>
        </li>
        <li>
          <a class="dropdown-item" href="#">
            Submenu &raquo;
          </a>
          <ul class="dropdown-menu dropdown-submenu">
            <li>
              <a class="dropdown-item" href="#">Submenu item 1</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Submenu item 2</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Submenu item 3 &raquo; </a>
              <ul class="dropdown-menu dropdown-submenu">
                <li>
                  <a class="dropdown-item" href="#">Multi level 1</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">Multi level 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a class="dropdown-item" href="#">Submenu item 4</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Submenu item 5</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

const getSearchForm = () => {
  return (
  <form class="form-horizontal container" role="form">
  <div class="form-group row my-3">
    <div class="col-sm-10">
      <input type="text" class="form-control select2-offscreen" id="parentAdddress" placeholder="Search on Youtube" tabIndex="-1"
          value={searchText} 
          onChange={(event) => setSearchText(event.target.value)}
      />
    </div>
    <div class="col-sm-1">
      {getSettingDropDown()}
    </div>
    <div class="col-sm-1">
        <button disabled={!searchText} class="btn btn-primary mx-1" onClick={(event) => getSearchResults(event)}>Search</button>
    </div>
  </div>
  {tokenExpired &&
    <div class="form-group mx-3">
      <p class="justify-content-center">Token expired! Please login again <Link to="/login">here</Link></p>
    </div>
  }
</form>
  );
}

  return (
    <div class="form-horizontal container" role="form">
        <div class="form-group justify-content-between">
          <div class="col-md-4">
          </div>
          <div class="col-md-auto">
            <div class="row-md-4">Search on Youtube</div>
          </div>
          <div class="col-md-4">
            {/* {getSampleTransition()} */}
          </div>
        </div>
        <hr/>
        {getSearchForm()}
        {getAnalysisForm()}
        {getVideoListForm()}
      </div>
  )
}

export default SearchScreen;