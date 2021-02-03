

/*chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    if(url.indexOf('google.') == -1)
    {
        chrome.tabs.create({ url: "https://google.com/search?q=dogs" });
    }
    else 
    {
    }
});
*/

chrome.tabs.create({ url: '/help.html'});
