// Get information about the tabs
var gettingActive = browser.tabs.query({
    currentWindow: true, active: true
});
gettingActive.then(checkCheckbox, onError);

// Check the status of checkbox
function checkCheckbox(tabs) {
	let checkbox = document.getElementById("check");
	let filteringText = document.getElementById("filteringText");
	let blockedContent = document.getElementById("blockedContent");
	let url = document.getElementById("url");
    browser.tabs.sendMessage(
      tabs[0].id,
      {greeting: "Checkbox status"}
    ).then(response => {
    	checkbox.checked = response.ischecked;
    	blockedContent.innerText = response.blocked;
    	url.innerText = response.url;
      console.log(url.innerText);
    	
    	if(response.ischecked == true){
    		filteringText.innerText = "Toggle to Stop Filtering";
    	}
    	else{
    		filteringText.innerText = "Toggle to Start Filtering";
    	}

    }).catch(onError);
}

// Start ot stop filtering based on a click on the checkbox
function startOrStopFiltering(tabs) {
	let checkbox = document.getElementById("check");
	let ischecked = checkbox.checked;

	if(ischecked == true){
    	filteringText.innerText = "Toggle to Stop Filtering";
    }
    else{
    	filteringText.innerText = "Toggle to Start Filtering";
    }

    browser.tabs.sendMessage(
      tabs[0].id,
      {greeting: "Hi from background script", "isFiltering": ischecked}
    ).then(response => {
      console.log("Message from the content script:");
      console.log(response.response);
    }).catch(onError);
  
}

// Error handling
function onError(error) {
  console.log('Error: ${error}');
  let filteringText = document.getElementById("filteringText");
  let checkbox = document.getElementById("check");
  filteringText.innerText = "Filtering not supported for this site";
  checkbox.checked = false;
}

// On a click on the checkbox, communicate with the content script
function sendmessage(){
	gettingActive.then(startOrStopFiltering, onError);
}
let checkbox = document.getElementById("check");
checkbox.addEventListener("click", sendmessage);