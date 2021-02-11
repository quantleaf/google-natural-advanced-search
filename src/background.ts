chrome.runtime.onInstalled.addListener(function() {
 /* chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  */
  chrome.browserAction.onClicked.addListener(function() {
    new chrome.declarativeContent.ShowPageAction()
  });
 

});

chrome.runtime.onMessage.addListener(function(message){
if (typeof message == 'string' && message == "__new_help_tab__"){
    window.open('/help.html','_blank');

 }
 if (typeof message == 'string' && message == "__new_donation_tab__"){
   window.open('https://www.buymeacoffee.com/quantleaf','_blank');
 }
});