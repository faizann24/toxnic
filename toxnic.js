// Threshold to use for toxic content classification. 
let THRESHOLD = 0.7;

// Store divs that are already parsed. 
let parsedDivs = {};

// If filtering is running or stopped
let isActive = true;

// Total number of posts/comments blocked
let contentBlocked = 0;

// Divs that have been blocked
let blockedDivs = [];

// Load model
var model = null;
const loadModel = async () => {
    console.log("Loading model...");
    const url = 'https://faizanahmad.tech/model2/model.json';
    const _model = await tf.loadLayersModel(url);
    model = _model;
    console.log("Model loaded...");
    return _model;
};
loadModel();

// Prune words
const MAX_SEQUENCE_LENGTH = 30;
function wordPreprocessor(word) {
  word = word.replace(/[-|.|,|\?|\!\"\\\!\n:~!@#$%^&*()*_+]+/g, '');
  word = word.replace(/\d+/g, '1');
  word = word.toLowerCase();
  if (word != '') {
    return word;
  } else {
    return ' '
  }
};

// Convert a word array into a sequence of word ids
function makeSequences(words_array) {
  let sequence = Array();
  let sentWords = Array();
  words_array.slice(0, MAX_SEQUENCE_LENGTH).forEach(function(word) {
    word = wordPreprocessor(word);
    let id = words_vocab[word];

    // do nothing if undefined
    if (id == undefined) {
      var nothing = 0;
    } 
    // store word id
    else {
      sequence.push(id);
      sentWords.push(word);
    }  
  });

  // pad sequence
  if (sequence.length < MAX_SEQUENCE_LENGTH) {
    let pad_array = Array(MAX_SEQUENCE_LENGTH - sequence.length);
    pad_array.fill(words_vocab['<PAD>']);
    sequence = sequence.concat(pad_array);
  }

  return sequence;
};

// Convert a sentence into a sequence of word ids
function sentenceToSequence(sentence){
  var words = sentence.split(" ");
  let sequence = makeSequences(words);
  let tensor = tf.tensor1d(sequence, dtype='int32').expandDims(0);
  return tensor;
}

// Make a decision about a piece of content
async function makeDecision(sentence, sequence, divInfo){
  if(model == null){
    return "model has not been loaded";
  }
  else{
    let prediction = await model.predict(sequence);
    let predictionData = await prediction.data();
    let isToxic = predictionData[1];
    if (isToxic > THRESHOLD){

      // uncomment the following lines to add console information about blocked content
      /*console.log("Toxic content with its probability...");
      console.log(sentence);
      console.log(isToxic);
      console.log("**********************************");*/

      divInfo.style.display = "none";
      contentBlocked = contentBlocked + 1;
      blockedDivs.push(divInfo);
    }
    return predictionData;
  }
}

// *********************************************** Twitter Content Filtering ****************************************** //
function analyzeDivsTwitter(){

  // get all divs
  var divs = document.getElementsByTagName("div");
  var allTweets = [];
  var allTweetsInfo = [];
  for(var i = 0; i < divs.length; i++){
     //do something to each div like

     var className = divs[i].className;
     var totalClasses = className.split(' ');
     var tweetText = divs[i].textContent;

     // if already parsed, skip
     if (tweetText in parsedDivs){
      continue;
     }

     parsedDivs[tweetText] = true;

     // skip if looking at trends, we only want to look at tweets
     if (tweetText.includes('Trends for you') == true){
     	continue;
     }

     // if the div is a tweet, operate on it
     if (divs[i].attributes.length == 0){
        if (tweetText.length > 10){ // a simple check on very short tweets

          // convert tweet into a sequence of word ids
          let sequence = sentenceToSequence(tweetText);

          // make a decision about whether the content is toxic or not
          makeDecision(tweetText, sequence, divs[i]);

        }
     }
  }
}

// *********************************************** Facebook Content Filtering ****************************************** //
function analyzeDivsFacebook(){

  // get all divs
  var divs = document.getElementsByTagName("div");
  for(var i = 0; i < divs.length; i++){
     var className = divs[i].className;
     var totalClasses = className.split(' ');
     var divText = divs[i].textContent;

     if (divText in parsedDivs){
      continue;
     }

     parsedDivs[divText] = true;

     // if the div is a post or a comment, operate on it
     if (divs[i].attributes.length == 0 && divText.length > 10 && divs[i].childElementCount == 1){
        let sequence = sentenceToSequence(divText);
        makeDecision(divText, sequence, divs[i]);
    }
  }
}

// *********************************************** Youtube Content Filtering ****************************************** //
function analyzeDivsYoutube(){
  var divs = document.getElementsByTagName("ytd-comment-renderer");
  for(var i = 0; i < divs.length; i++){
     var className = divs[i].className;
     var totalClasses = className.split(' ');
     var divText = divs[i].textContent;
     divText = divText.replace(/\s+/g, " ");

     if (divText in parsedDivs){
      continue;
     }

     parsedDivs[divText] = true;

     // if the div is a youtube comment, operate on it
     if (divText.length > 10){ 
        let sequence = sentenceToSequence(divText);
        makeDecision(divText, sequence, divs[i]);
    }
  }
}

// Content analysis ends here
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Look for changes in the page
var mutationObserver = new MutationObserver(function(mutations) {

  // only filter when active
  if (isActive == true){
    let pageUrl = window.location.href;

    // mutations have occurred
    var mutationsLength = mutations.length;

    // start filtering when there are more than 5 changes in the page
    if (mutationsLength > 5){
      if (pageUrl.includes("facebook.com") == true){ // facebook
        analyzeDivsFacebook();
      }
      else if (pageUrl.includes("youtube.com") == true){ // youtube
        analyzeDivsYoutube();
      }
      else if (pageUrl.includes("twitter.com") == true){ // twitter
        analyzeDivsTwitter();
      }
    }
  }
});

// Mutation observer object. Start observing
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});


//////////////////////////////////////////////////// Helper Functions ////////////////////////////////////////////////////
function showAllDivs(){
  // show all divs that have been blocked
  for(var i = 0; i < blockedDivs.length; i++){
    blockedDivs[i].style.display = "block";
    blockedDivs[i].style.backgroundColor = "rgba(233,43,43,0.3)";
  }
}

function hideAllDivs(){
  // re-block the previously blocked divs
  for(var i = 0; i < blockedDivs.length; i++){
    blockedDivs[i].style.display = "none";
  }
}


//////////////////////////////////////////////////// Communication between scripts ////////////////////////////////////////////////////
browser.runtime.onMessage.addListener(request => {

  // If the popup is opened - get the status of the page and the content filtering (whether filtering is active or not)
  if (request.greeting == "Checkbox status"){
    if (isActive == true){
      hideAllDivs();
    }
    else{
      showAllDivs();
    }
    return Promise.resolve({ischecked: isActive, blocked: contentBlocked, url: window.location.hostname});
  }

  // If the popup is already opened
  else{
    let isFiltering = request.isFiltering;
    if (isFiltering == true){
      hideAllDivs();
    }
    else{
      showAllDivs();
    }
    isActive = isFiltering;
    // Repond with a hi
    return Promise.resolve({response: "Hi from content script, all done..."});
  }
  
});