import CryptoJS from "crypto-js";

const salt = "ajsPamkanAmMnam22";
// const baseUrl = "http://180.188.226.161:8001"
const baseUrl = "http://localhost:8001"
const loginUrl = baseUrl + "/token/"
const videoSearchUrl = baseUrl + "/video-search/"
const videoSearchByTokenUrl = baseUrl + "/video-search-by-token/"
const commentAnalysisUrl = baseUrl + "/summarize-text/"
const extractCommentUrl = baseUrl + "/extract-text/"
const questionAnsweringUrl = baseUrl + "/answer-question/"
const getSummaryModelListUrl = baseUrl + "/summarize-models/"
const getQAModelListUrl = baseUrl + "/question-answering-models/"
const healthCheckUrl = baseUrl + "/healthcheck/"
const registerUrl = baseUrl + "/users/register/"

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
    questionAnsweringUrl, getSummaryModelListUrl, getQAModelListUrl, healthCheckUrl, registerUrl
};