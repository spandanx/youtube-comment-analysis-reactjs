// import React, {useState, useEffect} from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { TiTick } from "react-icons/ti";
import { BsExclamation } from "react-icons/bs";
import { TbMessageQuestion } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { BallTriangle } from 'react-loader-spinner';
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
// import {Animation, Button} from 'rsuite';
import './SearchScreen.css';

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
  const commentAnalysisUrl = "http://127.0.0.1:8000/summarize-text/"

  // const navigate = useNavigate();


    const [searchText, setSearchText] = useState('');
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [videoArray, setVideoArray] = useState([]);
    const [videoSelectMap, setVideoSelectMap] = useState({});
    const [videoSelectMapLength, setVideoSelectMapLength] = useState(0);
    const [videoAnalysis, setVideoAnalysis] = useState({});

    const [inProp, setInProp] = useState(false);
    const nodeRef = useRef(null);

    const [anim, setAnim] = useState(false);
    const [toggleVideoList, setToggleVideoList] = useState(false);
    const [toggleAnalysisList, setToggleAnalysisList] = useState(false);
    const firstTimeSearchDelay = 500; //ms
    

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
          let firstTimeLoad = false;
          if (videoArray.length == 0){
            firstTimeLoad = true;
          }
          setVideoArray(data);
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
        });
  }

  const analyzeVideoInformation = (event) => {
    event.preventDefault();
    setAnalysisLoading(true);
    setToggleAnalysisList(false);
    console.log("analyzing - " + searchText);
    // var queryUrl = commentAnalysisUrl;
    console.log({
      "ids": Object.keys(videoSelectMap)
     });
    //  console.log();
     
    fetch(commentAnalysisUrl, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "ids": Object.keys(videoSelectMap)
       })
     }).then(response => response.json())
     .then(data => {
       console.log("analyzed results - ");
       console.log(data);
       setAnalysisLoading(false);
       setToggleAnalysisList(true);
       setVideoAnalysis(data);
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

  const displayAnimation = (event) => {
    event.preventDefault();
    setToggleVideoList(!toggleVideoList); 
  }
  

  const getSearchForm = () => {
    return (
      // <div class="form-group row my-3 justify-content-between">
      //     <div class="col-md-4">
      //     </div>
      //     <div class="col-md-auto">Search on Youtube</div>
      //     <div class="col-md-4">
      //       </div>
      //   </div>
    <form class="form-horizontal container" role="form">
    <div class="form-group row my-3">
      <div class="col-sm-11">
        <input type="text" class="form-control select2-offscreen" id="parentAdddress" placeholder="Search on Youtube" tabIndex="-1"
            value={searchText} 
            onChange={(event) => setSearchText(event.target.value)}
        />
      </div>
      <div class="col-sm-1">
          <button disabled={!searchText} class="btn btn-success mx-1" onClick={(event) => getSearchResults(event)}>Search</button>
          {/* <button class="btn btn-success mx-1" onClick={(event) => displayAnimation(event)}>Display Animation</button> */}
          </div>
    </div>
  </form>
    );
}

const getLoadingAnimation = () => {
  return (
  <form class="form-horizontal container" role="form">
    <div class="form-group row my-3 justify-content-between">
      <div class="col-sm-5">
      </div>
      <div class="col-sm-auto">
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="white"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            />
          </div>
        <div class="col-sm-5">
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
        {toggleAnalysisList ? 
          <FaAnglesUp onClick={() => setToggleAnalysisList(!toggleAnalysisList)}/>
          :
          <FaAnglesDown onClick={(event) => setToggleAnalysisList(!toggleAnalysisList)}/>
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

const getVideoList = () => {
  return (
  // <CSSTransition in={anim} timeout={2000} classNames="videoitem">
    // <div class={`videocustom ${toggle ? 'show' : ''}`}>
    <div class={`videocustom ${toggleVideoList ? 'show' : ''}`}>
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
    </div>
    // </CSSTransition>
  )
}

const getAnalysisForm = () => {
  return (
    <div>
        <div class="form-group row my-3 justify-content-center">
            <div class="col-sm-auto">
                <button disabled={videoSelectMapLength==0} class="btn btn-success mx-1" onClick={(event) => analyzeVideoInformation(event)}>Get Analysis</button>
            </div>
        </div>
        <div class="d-flex align-items-center">
            {analysisLoading ? 
              getLoadingAnimation()
            :
            <></>  
          }
        </div>
        {Object.keys(videoAnalysis).length>0 &&
          <div>
            <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
            {getDownArrowAnalysisList()}
        </div>
        }
        <div class={`analysis-list ${toggleAnalysisList ? 'show' : ''}`}>
            {Object.keys(videoAnalysis).length>0 && 
            <div class="col">
              <div class="text-center">SUMMARY</div>
              <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
              <div class="text-center">{videoAnalysis.summary}</div>
              {/* <div class="text-center col-md-12 py-8">{videoAnalysis.summary}</div> */}
            </div>
            }
            <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
            <div class="col">
              {Object.keys(videoAnalysis).length>0 ?
                <div class="text-center">QUESTIONS</div>
              :
                <div></div>
              }
          </div>

          {Object.keys(videoAnalysis).length>0 ? videoAnalysis.questions.map((question)=>(
            <div class="d-flex align-items-center">
              <div class="p-2 bd-highlight">
                <TbMessageQuestion color="red"/>
              </div>
              <div class="p-2 bd-highlight">
                <a class="nav-link">{question}</a>
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
          {videoArray.length > 0 ? 
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
        {videoArray.length > 0 ? 
          getVideoList()
        :
        <div></div>
        }
      </div>
  )
}

  return (
    <div class="form-horizontal container" role="form">
        <div class="form-group row my-3 justify-content-between">
          <div class="col-md-4">
          </div>
          <div class="col-md-auto">Search on Youtube</div>
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