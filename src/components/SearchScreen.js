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
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import ReactPaginate from 'react-paginate';
// import Select from 'react-select'
// import { IoWarningSharp } from "react-icons/io5";
// import { Bars } from 'react-loading-icons'
import { BiError } from "react-icons/bi";
// import {Animation, Button} from 'rsuite';
import './SearchScreen.css';
import './styles/LoadingText.css';
// import './styles/ModelSelection.css';
import './styles/SummaryModelSelection.css';
import './styles/videopagination.css';
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

const SearchScreen = () => {

  const videoSearchUrl = "http://127.0.0.1:8000/video-search/"
  const videoSearchByTokenUrl = "http://127.0.0.1:8000/video-search-by-token/"
  const commentAnalysisUrl = "http://127.0.0.1:8000/summarize-text/"
  const extractCommentUrl = "http://127.0.0.1:8000/extract-text/"
  const questionAnsweringUrl = "http://127.0.0.1:8000/answer-question/"
  const getSummaryModelListPath = "http://127.0.0.1:8000/summarize-models/"
  const getQAModelListPath = "http://127.0.0.1:8000/question-answering-models/"

  // const navigate = useNavigate();


    const [searchText, setSearchText] = useState('');
    const [videoArray, setVideoArray] = useState([]);
    const [videoSelectMap, setVideoSelectMap] = useState({});
    const [videoSelectMapLength, setVideoSelectMapLength] = useState(0);
    const [videoSearchError, setVideoSearchError] = useState("");
    const [commentData, setCommentData] = useState({});

    const [extractionLoading, setExtractionLoading] = useState(false);
    const [toggleExtractionList, setToggleExtractionList] = useState(false);
    const [textExtractionisError, setTextExtractionisError] = useState("");

    const [QALoading, setQALoading] = useState(false);
    const [QAExtractionList, setQAExtractionList] = useState(false);
    // const [QAisError, setQAisError] = useState("");
    const [QAAnalysis, setQAAnalysis] = useState({});

    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [toggleAnalysisList, setToggleAnalysisList] = useState(false);
    const [videoAnalysis, setVideoAnalysis] = useState({});
    const [videoAnalysisError, setVideoAnalysisError] = useState("");


    // const [videoAnalysis, setVideoAnalysis] = useState({});
    // const [videoAnalysis, setVideoAnalysis] = useState({"summary": "ka Cedar inn is most of the beautiful snd nice hotel I very nice and informative Easy hotel ka name tell me where bike parking avelbel ho Best part ye h ki unmarried couple can also go h Darjeeling me strength room the Beautiful keep it up In one room can we stay 5 person Hi Anjali, Just confused with Summit Montana suites and spa and Yashshree Sanderling which is better.",
    // "questions": [
    //   {
    //     "question": "Oct main How about weather?",
    //     "answer": {
    //       "score": 0.0618143193423748,
    //       "start": 509,
    //       "end": 512,
    //       "answer": "two"
    //     }
    //   },
    //   {
    //     "question": "Kitchen I am not?",
    //     "answer": {
    //       "score": 0.048960890620946884,
    //       "start": 346,
    //       "end": 400,
    //       "answer": "Summit Montana suites and spa and\nYashshree Sanderling"
    //     }
    //   },
    //   {
    //     "question": "How to book ?",
    //     "answer": {
    //       "score": 0.19173763692378998,
    //       "start": 509,
    //       "end": 512,
    //       "answer": "two"
    //     }
    //   },
    //   {
    //     "question": "What if agar October me planning hollow to approximately how much will it cost",
    //     "answer": {
    //       "score": 0.6830801367759705,
    //       "start": 509,
    //       "end": 512,
    //       "answer": "two"
    //     }
    //   },
    //   {
    //     "question": "Few hotels from this list have very very bad reviews. How can you say those best?",
    //     "answer": {
    //       "score": 0.09604348987340927,
    //       "start": 43,
    //       "end": 55,
    //       "answer": "ka\nCedar inn"
    //     }
    //   },
    //   {
    //     "question": "Any problem for unmarried couple in single room?",
    //     "answer": {
    //       "score": 0.037298500537872314,
    //       "start": 262,
    //       "end": 282,
    //       "answer": "Beautiful keep it up"
    //     }
    //   },
    //   {
    //     "question": "Great ",
    //     "answer": {
    //       "score": 0.5304459929466248,
    //       "start": 380,
    //       "end": 400,
    //       "answer": "Yashshree Sanderling"
    //     }
    //   }
    // ]
    // });
    

    const [inProp, setInProp] = useState(false);
    const nodeRef = useRef(null);

    const [anim, setAnim] = useState(false);
    const [toggleVideoList, setToggleVideoList] = useState(false);

    const firstTimeSearchDelay = 500; //ms

    const [selectedSummaryModel, setSelectedSummaryModel] = useState("Abstractive - BARTAbstractiveSummarizer");

    const [selectedQAModel, setSelectedQAModel] = useState("DistilbertQuestionAnswering");

    const [fullVideoObject, setFullVideoObject] = useState({});

    const [summaryModels, setSummaryModels] = useState([
      "Abstractive - BARTAbstractiveSummarizer",
      "Abstractive - DistilbertSummarizer"
    ]);

    const [qaModels, setQAModels] = useState([
      "DistilbertQuestionAnswering"
    ]);

    // const options = [
    //   { value: 'chocolate', label: 'Chocolate' },
    //   { value: 'strawberry', label: 'Strawberry' },
    //   { value: 'vanilla', label: 'Vanilla' }
    // ]
    

    //   {
    //     "summary": "bbc is a very unique place for the crabs to crawl in horror mode . the penguins and the sea lions &amp; eel vs. crabs are all out of the same level .",
    //     "questions": [
    //         "What nature scene is your favourite? 🌎",
    //         "My favourite scene is &quot;what lurks in the midnight zone?&quot;",
    //         "​@@kittycat4ever2🎉nc😮🎉Nmz😮🎉c <a href=\"https://www.youtube.com/watch?v=SIm3nKfJnFE&amp;t=3779\">1:02:59</a> 😮🎉",
    //         "@@kittycat4ever2😅😊",
    //         "@@kittycat4ever2😊",
    //         "​@@kittycat4ever2dd",
    //         "👍🏻👍🏻👍🏻"
    //     ]
    // }
    // );

    const accountTypes = ["EMPLOYEE", "DEPARTMENT", "AUDITOR"];

    useEffect(() => {
      getQAModels();
      getSummaryModels();
    }, []);


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

  const getSearchResults = (event) => {
    event.preventDefault();
    setToggleVideoList(false);
    console.log("querying - " + searchText);
    var queryUrl = videoSearchUrl + "?searchText=" + searchText + "&max_results="+"10"
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl)
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

  const getSearchResultsByPageToken = (pageToken) => {
    // event.preventDefault();
    setToggleVideoList(false);
    console.log("querying - " + searchText);
    var queryUrl = videoSearchByTokenUrl + "?pageToken=" + pageToken + "&max_results=10"
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl)
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

  const getSummaryModels = () => {
    fetch(getSummaryModelListPath, {
      method: 'get',
      headers: {'Content-Type':'application/json'}
     }).then(response => response.json())
     .then(data => {
        console.log("Summary Models - ");
        console.log(data);
        setSummaryModels(data);
     })
     .catch(error => {
      console.log("ERROR Occurred - ");
      console.error(error);
      console.log("Error! Could not get the summary models!");
    });
  }

  const getQAModels = () => {
    fetch(getQAModelListPath, {
      method: 'get',
      headers: {'Content-Type':'application/json'}
     }).then(response => response.json())
     .then(data => {
        console.log("QA Models - ");
        console.log(data);
        setQAModels(data);
     })
     .catch(error => {
      console.log("ERROR Occurred - ");
      console.error(error);
      console.log("Error! Could not get the QA models!");
    });
  }

  const extractVideoText = (event) => {
    event.preventDefault();
    setExtractionLoading(true);
    setToggleExtractionList(false);
    setTextExtractionisError("");
    console.log("analyzing - " + searchText);
    // var queryUrl = commentAnalysisUrl;
    console.log({
      "ids": Object.keys(videoSelectMap)
     });
    //  console.log();
     
    fetch(extractCommentUrl, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
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
        setTextExtractionisError("");
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
    getSummaryInformation(event);
    getQuestionAnswer(event);
  }

  const getSummaryInformation = (event) => {
    event.preventDefault();
    setAnalysisLoading(true);
    setToggleAnalysisList(false);
    setVideoAnalysisError("");
    setVideoAnalysis({});
    console.log("analyzing - " + searchText);
    // var queryUrl = commentAnalysisUrl;
    console.log({
      "texts": commentData.statements,
      "summModel": "Abstractive - BARTAbstractiveSummarizer"
     });
    //  console.log();
     
    fetch(commentAnalysisUrl, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
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
        setAnalysisLoading(false);
        setToggleAnalysisList(true);
        setVideoAnalysis(data);

        // console.log("Object.keys(videoAnalysis).length");
        // console.log(Object.keys(videoAnalysis).length);
        // console.log("videoAnalysis.summary");
        // console.log(videoAnalysis.summary);
        setVideoAnalysisError("");
      //  }
      //  else{
      //   console.log("ERROR Occurred in response ");
      //   setAnalysisLoading(false);
      //   setVideoAnalysisError("Error! Could not process the analysis request!");
      //  }
      //  console.log("lengths - ");
      //  console.log(Object.keys(videoAnalysis).length);
      //  console.log(isNaN(videoAnalysis.question));
      //  console.log(videoAnalysis.questions?.length);
     })
     .catch(error => {
        // console.log("Printing Status - ERROR");
        // console.log(error.status);
        // console.log(!error.ok);
      console.log("ERROR Occurred - ");
      console.error(error);
      setAnalysisLoading(false);
      setVideoAnalysisError("Error! Could not process the analysis request!");
      // console.log(Object.keys(videoAnalysis).length);
      // console.log(isNaN(videoAnalysis.question));
      // console.log(videoAnalysis.questions?.length);
    });
  }

  const getQuestionAnswer = (event) => {
    event.preventDefault();
    setQALoading(true);
    setQAExtractionList(false);
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
     
    fetch(questionAnsweringUrl, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
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
        setQAExtractionList(true);
        setQAAnalysis({"questions" : data});
        setVideoAnalysisError("");
        console.log("Object.keys(QAAnalysis).length");
        console.log(Object.keys(QAAnalysis).length);
        console.log("QAAnalysis.questions.length");
        console.log(QAAnalysis.questions.length);
      //  }
      //  else{
      //   console.log("ERROR Occurred in response ");
      //   setQALoading(false);
      //   setVideoAnalysisError("Error! Could not process the Question Answering request!");
      //  }
      //  console.log("lengths - ");
      //  console.log(Object.keys(videoAnalysis).length);
      //  console.log(isNaN(videoAnalysis.question));
      //  console.log(videoAnalysis.questions?.length);
     })
     .catch(error => {
        // console.log("Printing Status - ERROR");
        // console.log(error.status);
        // console.log(!error.ok);
      console.log("ERROR Occurred - ");
      console.error(error);
      setAnalysisLoading(false);
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

const getLoadingAnimation = () => {
  return (
  <form class="form-horizontal container" role="form">
    <div class="form-group row my-3 justify-content-center">
      <div class="col-sm-auto">
      </div>
      <div class="col-sm-auto">
        <div class="loader"></div>
          {/* <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="white"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            /> */}
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
          <FaAnglesDown onClick={(event) => setToggleExtractionList(!toggleExtractionList)}/>
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
    // <ReactPaginate
    //       containerClassName={"pagination"}
    //       pageClassName={"page-item"}
    //       activeClassName={"active-page"}
    //       breakLabel="..."
    //       nextLabel="next >"
    //       pageRangeDisplayed={5}
    //       pageCount={itemCount}
    //       previousLabel="< previous"
    //       renderOnZeroPageCount={null}
    //   />
    // <div class="d-flex align-items-center">
    //     <div class="p-8 bd-highlight"></div>
    //     <div class="p-2 bd-highlight">
    //     <MdNavigateBefore/>Previous Page
    //     </div>
    //     <div class="p-2 bd-highlight">
    //       Next Page<MdNavigateNext/>
    //     </div>
    //   </div>
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

const getVideoList = () => {
  return (
  // <CSSTransition in={anim} timeout={2000} classNames="videoitem">
    // <div class={`videocustom ${toggle ? 'show' : ''}`}>
    <div class={`videocustom ${toggleVideoList ? 'show' : ''}`} style={{"overflow-y": "scroll"}}>
      <input value = "test" class = "align-items-stretch" type = "checkbox" onChange = {(event) => updateVideoMapAll(videoArray)}/>
      {/*   */}
      {getVideoListPagination(fullVideoObject["prevPageToken"], fullVideoObject["nextPageToken"])}
      <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
      {videoArray.map((videoItem)=>(

      <div class="d-flex align-items-center">
        <div class="p-2 bd-highlight">
          <input value = "test" class = "align-items-stretch" type = "checkbox" onChange = {(event) => {updateVideoMap(videoItem.videoId)}} />
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
                <button disabled={videoSelectMapLength==0} class="btn btn-success mx-1" onClick={(event) => extractVideoText(event)}>Extract Text</button>
            </div>
            <div class="col-sm-1">
              {Object.keys(commentData).length > 0 ? 
                <p class="my-auto">Extracted <LuCheckCircle style={{ color: "green"}}/></p>
                : <></>
              }
            </div>
            <div class="col-sm-auto">
                <button disabled={Object.keys(commentData).length == 0} class="btn btn-success mx-1" onClick={(event) => analyzeVideoInformation(event)}>Get Analysis</button>
            </div>
        </div>
        <div class="d-flex align-items-center">
            {extractionLoading &&  
              getLoadingAnimation()
            }
            {textExtractionisError.length > 0 && 
              getWarningMessage(textExtractionisError)
            }
        </div>
        {Object.keys(videoAnalysis).length>0 &&
          <div>
            <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }}/>
            {getDownArrowAnalysisList()}
        </div>
        }
        <div class={`analysis-list ${toggleAnalysisList ? 'show' : ''}`} style={{"overflow-y": "scroll"}}>
        {/* <div class={`analysis-list show`} style={{"overflow-y": "scroll"}}> */}
            {Object.keys(videoAnalysis).length>0 ?
            <div class="col">
              <div class="text-lft">SUMMARY</div>
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
              {Object.keys(QAAnalysis).length>0 ?
                <div class="text-center">QUESTIONS</div>
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

// const getVideoPagination = () => {
//   return (
//     <ReactPaginate
//         breakLabel="..."
//         nextLabel="next >"
//         pageRangeDisplayed={5}
//         pageCount={10}
//         previousLabel="< previous"
//         renderOnZeroPageCount={null}
//       />
//   );
// }

const getVideoListForm = () => {
  return (
    <div>
          {videoSearchError!=null && videoSearchError.length > 0 && 
            getWarningMessage(videoSearchError)
          }
          {(videoArray!= null && videoArray.length > 0) || (fullVideoObject["nextPageToken"] != null) ? 
            <div class="col">
                <div class="text-center">VIDEOS</div>
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

const getSummaryModelList = () => {
  let modelList = [];
    summaryModels.forEach(function(summaryModel) {
      modelList.push(
        <a onClick={(summaryModel)=>setSelectedSummaryModel(summaryModel)}>{summaryModel}</a>
      );
    });
    return modelList;
}

// const getSettingDropDown = () => {
//   return (
//     <div class="btn-group">
//     <a type="button" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//       <RiSettings4Fill style={{ color: "black"}}/>
//     </a>
//     <div class="dropdown-menu dropdown-menu-right">
//       <a class="dropdown-item fw-bold">{"ABC"}</a>
//       <div class="dropdown-divider"></div>
//       <a class="dropdown-item">Sample Account</a>
//       <div class="modelselection">
//         <button class="modelselectionbtn">{selectedModel}</button>
//         <div class="modelselection-content">
//           {getSummaryModelList()}
//         </div>
//       </div>
//     </div>
//   </div>
//   )
// }

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
      {/* <button data-mdb-button-init
        data-mdb-ripple-init data-mdb-dropdown-init class="btn btn-primary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-mdb-toggle="dropdown"
        aria-expanded="false"
      >
        Select
      </button> */}
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item">Select Summary Model</a></li>
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
                {summaryModels.map((summaryModel) => 
                <li><a class="dropdown-item" style={{"backgroundColor": summaryModel==selectedSummaryModel ? "green":""}} onClick={()=>setSelectedSummaryModel(summaryModel)}>{summaryModel}</a></li>
              )}
            </ul>
          </div>
        </li>
        {/* <li><a class="dropdown-item">{selectedModel}</a></li> */}
        {/* <li>
          <ul class="dropdown-menu dropdown-submenu">
          {summaryModels.map((summaryModel) => 
            <li><a class="dropdown-item" onClick={()=>setSelectedModel(summaryModel)}>{summaryModel}</a></li>
          )}
          </ul>
        </li> */}
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
                {qaModels.map((qaModel) => 
                <li><a class="dropdown-item" style={{"backgroundColor": qaModel==selectedQAModel ? "green":""}} onClick={()=>setSelectedQAModel(qaModel)}>{qaModel}</a></li>
              )}
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
        <button disabled={!searchText} class="btn btn-success mx-1" onClick={(event) => getSearchResults(event)}>Search</button>
    </div>
  </div>
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