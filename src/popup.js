

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    //alert(document.location.href.indexOf('google.') + " --- " + document.location.href)
    if(url.indexOf('google.') == -1)
    {
        chrome.tabs.create({ url: "https://google.com/search?q=dogs" });
    }
    else 
    {
        chrome.tabs.create({ url: '/src/help.html'});
    }
});


