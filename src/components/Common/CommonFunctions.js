import CryptoJS from "crypto-js";

const salt = "ajsPamkanAmMnam22";
const loginUrl = "http://127.0.0.1:8000/token/"
const videoSearchUrl = "http://127.0.0.1:8000/video-search/"
const videoSearchByTokenUrl = "http://127.0.0.1:8000/video-search-by-token/"
const commentAnalysisUrl = "http://127.0.0.1:8000/summarize-text/"
const extractCommentUrl = "http://127.0.0.1:8000/extract-text/"
const questionAnsweringUrl = "http://127.0.0.1:8000/answer-question/"
const getSummaryModelListUrl = "http://127.0.0.1:8000/summarize-models/"
const getQAModelListUrl = "http://127.0.0.1:8000/question-answering-models/"
const healthCheckUrl = "http://127.0.0.1:8000/healthcheck/"

const encryptData = (text) => {
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        salt
    ).toString();
        console.log("encryptData() - input - ", text, " Output -  ", data);
        return data;
    };

const decryptData = (text) => {
    console.log("Calling decryptData()");
    console.log(text);
    console.log(salt);
    const bytes = CryptoJS.AES.decrypt(text, salt);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log("decryptData() - input - ", text, " Output -  ", data);
    return data;
};

export {salt, encryptData, decryptData, loginUrl, videoSearchUrl, videoSearchByTokenUrl, commentAnalysisUrl, extractCommentUrl, 
    questionAnsweringUrl, getSummaryModelListUrl, getQAModelListUrl, healthCheckUrl
};