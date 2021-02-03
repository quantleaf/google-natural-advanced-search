chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  
 

});
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo) {
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: '__new_url_ql__',
        url: changeInfo.url
      });
    }
  }
);

chrome.runtime.onMessage.addListener(function(message){
  if (message == "__new_help_tab__"){
     chrome.tabs.create({ url: '/help.html'});
  }
});