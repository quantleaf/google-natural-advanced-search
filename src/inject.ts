import { ConditionAnd, ConditionCompare, ConditionElement, Unknown } from '@quantleaf/query-result'
import { allWordsKey, anyOfKey, countryKey, dateKey, exactPhraseKey, languageKey, notAnyOfWordsKey, numbersRangeKey, unitKey, websiteKey, textLocationKey, safeSearchKey, fileTypeKey, licenseKey, resultType, GeneralSearch } from './advanced-search-schema'; // , Text, Images, News, Shopping 
import { translate, config, generateSchema } from '@quantleaf/query-sdk-node';
import { QueryResponse } from '@quantleaf/query-request';

//Models
interface ParsedQuery {
    searchParams?: string;
    searchParamsPre?: string;
    queryParams?: {
        key: string,
        value: string
    }[];
}
interface QuerySession {
    lastReadableQuery?: string,
    lastResponse?: QueryResponse;
    parsedQuery?: ParsedQuery,
    unparsedQuery?: string
}
// URL
const urlSearchPath = "/search";

// Settings
const debounceTime = 200; //ms
const api = 'https://api.query.quantleaf.com';
const apiKeySetup = fetch(api + '/auth/key/demo').then((resp) => resp.text().then((apiKey) => { config(apiKey); return apiKey }));

// State
var initializedUI = false;
var expanded: boolean = false; // pre initalization, then its either true or false
var expandedOpenedManually: boolean = false;
var sess: QuerySession = {}
var ctrlDown: boolean = false;
var lastRequestTime: number = new Date().getTime();
var lastSuggestions: string | undefined;
var showSuggestions: boolean = false;
var lastSearchField: HTMLInputElement | null | undefined = null;
//var defaultSearchButton:Element|null|undefined = null;
var defaultSearchButtonIcon: Element | null | undefined = null;
var formInputParent: HTMLElement | null | undefined = null;
var lastRestoredState: QuerySession;
var scrollingEventPerforming = false;
var insertedLastUnparsedQuery = false;
var hasTypedAnything = false;

// UI
var advancedSearchElementWrapper = document.createElement('div');
advancedSearchElementWrapper.style.position = 'relative';
advancedSearchElementWrapper.style.zIndex = '1000';
var advancedSearchElement = document.createElement('div');
advancedSearchElementWrapper.appendChild(advancedSearchElement);
advancedSearchElement.style.position = 'fixed'
//advancedSearchElement.style.left = '100%';
//advancedSearchElement.style.top = '0px';
var expandedContainer = document.createElement('div');
expandedContainer.style.backgroundColor = "white";
expandedContainer.style.padding = "20px";
expandedContainer.style.minWidth = "185px";
expandedContainer.style.width = "185px";
expandedContainer.style.borderRadius = "24px";
expandedContainer.style.padding = "12px 20px";
expandedContainer.style.display = 'flex';
expandedContainer.style.flexDirection = 'row';
expandedContainer.style.zIndex = '1000';
expandedContainer.style.boxShadow = "0 2px 8px 1px rgb(64 60 67 / 24%)";
expandedContainer.style.justifyContent = 'left';
expandedContainer.style.margin = "0px 20px 0 14px";
expandedContainer.style.whiteSpace = "normal";
expandedContainer.style.lineHeight = "initial";

var textContent = document.createElement('div')
textContent.style.zIndex = '1000';
textContent.style.display = 'flex';
textContent.style.flexDirection = 'column';
textContent.style.width = '100%';

expandedContainer.appendChild(textContent);

var minimizedContainer = document.createElement('div');
minimizedContainer.style.display = 'flex';
minimizedContainer.style.justifyContent = 'center';
minimizedContainer.style.alignItems = 'center';
minimizedContainer.style.margin = '0px 20px 0 14px';
minimizedContainer.style.cursor = 'pointer';
minimizedContainer.style.zIndex = '1000';
minimizedContainer.style.boxShadow = 'rgb(64 60 67 / 24%) 0px 2px 8px 1px';
minimizedContainer.style.background = 'none';
minimizedContainer.style.backgroundColor = 'white';
minimizedContainer.style.height = '24px';
minimizedContainer.style.width = '24px';
minimizedContainer.style.borderRadius = '24px';
minimizedContainer.onmouseenter = function () {
    minimizedContainer.style.boxShadow = "rgb(64 60 67 / 34%) 0px 2px 8px 1px";
};

minimizedContainer.onmouseleave = function () {
    setScrollStyle();
};


var infoDiv = document.createElement('div');
infoDiv.style.zIndex = "1000";
infoDiv.style.display = 'flex';
infoDiv.style.flexDirection = 'column'
infoDiv.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
infoDiv.style.width = '100%';
textContent.appendChild(infoDiv);

var header = document.createElement('div');
header.style.zIndex = "1000";
header.style.display = 'flex';
header.style.flexDirection = 'row'
header.style.width = '100%';
var title = document.createElement('span');
title.innerHTML = 'Advanced Search'
title.style.fontWeight = '600';

header.appendChild(title);

var searchButton = document.createElement('div')
searchButton.style.cursor = 'pointer';
searchButton.style.zIndex = "1000";
searchButton.style.background = "none";
searchButton.style.fill = "#4285f4";
searchButton.style.height = "24px";
searchButton.style.width = "24px";
searchButton.style.marginLeft = "auto";

searchButton.innerHTML = '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>'
/*
var helpButton = document.createElement('div')
helpButton.style.cursor = 'pointer';
helpButton.style.zIndex = "1000";
helpButton.style.background = "none";
helpButton.style.fill = "#4285f4";
helpButton.style.height = "24px";
helpButton.style.width = "24px";
helpButton.style.marginLeft = "auto";
helpButton.innerHTML = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>'
header.appendChild(helpButton);

*/

header.appendChild(searchButton);

infoDiv.appendChild(header);

var suggestionsContainer = document.createElement('span');
suggestionsContainer.innerHTML = ''
suggestionsContainer.style.fontSize = 'small';
suggestionsContainer.style.whiteSpace = 'nowrap';
infoDiv.appendChild(suggestionsContainer);

var textContainer = document.createElement('div');
textContent.appendChild(textContainer);
textContainer.style.whiteSpace = "pre-wrap";
textContainer.style.wordWrap = "break-word";
textContainer.style.paddingTop = "10px";
textContainer.style.paddingBottom = "10px";
//textContainer.style.fontWeight = "bold";
textContainer.style.fontFamily = "monospace";

var footer = document.createElement('div');
footer.style.lineHeight = '10px';
footer.style.fontStyle = "italic";
footer.style.marginLeft = "auto";
footer.style.marginTop = "5px";
footer.style.whiteSpace = "normal";
footer.style.fontSize = '8pt';
footer.style.color = "#70757a"
footer.style.display = 'flex';
footer.style.flexDirection = 'column';

var helpButton = document.createElement('span');
helpButton.innerHTML = 'What can I to write?'
helpButton.style.marginLeft = "auto";
helpButton.style.marginBottom = "4px";
helpButton.style.cursor = "pointer";
helpButton.onmouseenter = function () {
    helpButton.style.textDecoration = 'underline'
};

helpButton.onmouseleave = function () {
    helpButton.style.textDecoration = ''
};
helpButton.onclick = function () 
{
    chrome.runtime.sendMessage("__new_help_tab__");
}
footer.appendChild(helpButton);

var tip = document.createElement('span');

const showKeyswWordsHTML = 'Show suggestions (ctrl) + (space)';
const hideKeyswWordsHTML = 'Hide suggestions (ctrl) + (space)';
tip.innerHTML = showKeyswWordsHTML;;
tip.style.marginLeft = "auto";
tip.style.cursor = "pointer";

tip.onmouseenter = function () {
    tip.style.textDecoration = 'underline'
};

tip.onmouseleave = function () {
    tip.style.textDecoration = ''
};
tip.onclick = function () 
{
    showSuggestions = !showSuggestions;
    printSuggestions();
}


footer.appendChild(tip);
textContent.appendChild(footer);

function findElementWithShadowOrBorder(element: (HTMLElement | undefined | null)) {
    let curr: (HTMLElement | undefined | null) = element;
    while (curr) {
        const style = window.getComputedStyle(curr as HTMLElement);
        if (style.borderRadius && style.borderRadius != "0px")
            return curr;
        curr = curr.parentElement;
    }
    return null;


}


function setDynamicStyle() {

    // const inputWrapperStyle = window.getComputedStyle(formInputParent as HTMLElement);
    // (formInputParent as HTMLElement).style.display = "flex";
    /*if(formInputParent)
    {
        formInputParent.style.zIndex = "1000";
        formInputParent.style.position = "relative";
    }*/
   

}

function setScrollStyle() {
    if(!formInputParent)
        return;
    const inputWrapperStyle = window.getComputedStyle(formInputParent as HTMLElement);
    const br = formInputParent?.getBoundingClientRect() as DOMRect;
    advancedSearchElement.style.left = `${br?.x + br?.width}px`
    advancedSearchElement.style.top = `${br?.y}px`
    minimizedContainer.style.boxShadow = formInputParent.style.boxShadow && formInputParent.style.boxShadow != 'none' ?  formInputParent.style.boxShadow : inputWrapperStyle.boxShadow ;
    minimizedContainer.style.height = inputWrapperStyle.height;
    minimizedContainer.style.width = inputWrapperStyle.height;
    let viewBox: string | null = "0 0 24 24";
    let width = "24px";
    let height = "24px";
    minimizedContainer.style.border = inputWrapperStyle.border;
    if (defaultSearchButtonIcon) {
        viewBox = defaultSearchButtonIcon.getAttribute('viewBox');
        width = window.getComputedStyle(defaultSearchButtonIcon).width;
        height = window.getComputedStyle(defaultSearchButtonIcon).height;
    }
    minimizedContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#4285f4" viewBox="${viewBox}" width="${width}" height="${height}"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`
    
    
    //minimizedContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#4285f4" viewBox="${viewBox}" width="${width}" height="${height}"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>`
    //
    //minimizedContainerIcon.style.width =  ;
    //minimizedContainerIcon.style.height =  window.getComputedStyle(defaultSearchButton).height;


}

// Add listeners for the search field, and set colors for styling (depending on color mode, light, dim, dark)
async function initialize() {
    var inserted = false;
    let maxTriesFind = 50;
    let findCounter = 0;
    while (!inserted) {
        const searchField = document.querySelector('form * input[spellcheck="false"]') as HTMLInputElement;
        findCounter++;
        if (findCounter > maxTriesFind)
            break;
        if (searchField)
            inserted = true;
        else {
            await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 sec
            continue;
        }
        if (lastSearchField === searchField)
            return;
        lastSearchField = searchField;

        // defaultSearchButtonIcon = document.querySelector('form * button * svg');
        //  formInputParent = defaultSearchButtonIcon?.parentElement?.parentElement?.parentElement?.parentElement;
        formInputParent = findElementWithShadowOrBorder(searchField?.parentElement?.parentElement?.parentElement);
        if (formInputParent)
            formInputParent.appendChild(advancedSearchElementWrapper);
        //defaultSearchButton = document.querySelector('form * button[type="submit"]');
        setDynamicStyle();
        setScrollStyle();
        restoreLastSearchQuery();
        toggleVisuals(false);

        document.addEventListener("keydown", event => {
            if (event.keyCode === 13) {
                event.cancelBubble = true;
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();
                navigateSearch(ctrlDown);
                return;
            }
        }, {
            capture: true

        });

        lastSearchField.addEventListener("keydown", event => {
            if (event.keyCode === 13) {
                event.cancelBubble = true;
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();
                navigateSearch(ctrlDown);
                return;
            }
        }, {
            capture: true

        });

        lastSearchField.addEventListener("keyup", event => {
            hasTypedAnything = true;
            sess.unparsedQuery = event.target && event.target['value'] ? event.target['value'] : '';
            sess.lastReadableQuery = undefined;
            sess.lastResponse = undefined;
            sess.parsedQuery = undefined;
            setTimeout(() => {

                if ((lastRequestTime + debounceTime) < new Date().getTime()) {

                    getResult(lastSearchField?.value).then(() => {
                        // Hide or show
                        if (sess.lastReadableQuery && !expanded) {
                            expandedOpenedManually = false;
                            toggleVisuals(true);
                        }

                        else if (!sess.lastReadableQuery && !expandedOpenedManually) {

                            toggleVisuals(false); // The suggestions have opened automatically, hence we also close automatically
                        }
                        saveState();
                    });


                }
            }, debounceTime + 1);
            lastRequestTime = new Date().getTime();
        });
        lastSearchField.addEventListener("click", () => {
            
            restoreSearchFieldText();

            let showExpanded = !!sess.lastResponse?.query && sess.lastResponse.query.length > 0;
            if (!showExpanded && expanded) {
                showExpanded = true;
            }
            toggleVisuals(showExpanded || expandedOpenedManually);

        });

        minimizedContainer.addEventListener("click", event => {

            restoreSearchFieldText(); 

            expandedOpenedManually = true;
            showSuggestions = true;
            printSuggestions();
            toggleVisuals(true);

            event.stopPropagation();
            event.stopImmediatePropagation();
        });


        searchButton.addEventListener("click", () => {
            navigateSearch(true);
        })

        document.body.addEventListener("keydown", event => {
            if (event.keyCode === 17) {
                ctrlDown = true;
                return;
            }
        });
        document.body.addEventListener("keyup", event => {
            if (event.keyCode === 17) {
                ctrlDown = false;
            }
            if (event.keyCode === 32) {
                // Space clicked, toggle suggestions
                if (ctrlDown) {
                    showSuggestions = !showSuggestions;
                    if (!expanded)
                        showSuggestions = true;
                    printSuggestions();
                    expandedOpenedManually = true;
                    if(showSuggestions)
                        toggleVisuals(true);
                }
                return;
            }
        });


        window.addEventListener('click', function (e) {
            if (e.target)
                if (expandedContainer.contains(e.target as Node) || formInputParent?.contains(e.target as Node)) {
                    // clicked somewhere that should not minimize the advanced search popup
                } else {
                    if (expanded) {
                        toggleVisuals(false, true);

                    }
                }
        });

        document.addEventListener('scroll', function () {
            if (!scrollingEventPerforming) {
                window.requestAnimationFrame(function() {
                    setScrollStyle();
                    setTimeout(() => {
                        setScrollStyle();
                    }, 50); // Seems to fix problem with fast scroll not providing correct computed styles
                    scrollingEventPerforming = false;
                });

                scrollingEventPerforming = true;
            }
        });
    }
}

initialize(); // Starting point 1
chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === '__new_url_ql__') {
            initialize();  // Starting point 2
        }
    });
/*
MutationObserver = window.MutationObserver;

var observer = new MutationObserver(function() {
    setTimeout(() => {
        setScrollStyle();
    }, 10);
});

observer.observe(document, {
    subtree: true,
    attributes: true,
});*/


// The search experience, code that define the translation to natural language to the generalized query structure
// and code that transform the generalized query structure into twitter query syntax

// We hard code the keys since we are to reference them on two places
/*const dateKey = 'date';
const allWordsKey = 'allWordsKey';
const anyOfKey = 'anyOf';
const exactPhraseKey = 'exactPhrase';
const notAnyOfKey = 'nonOf';
const numbersRangeKey = 'numbersRange';
const unitKey = 'unit';
const languageKey = 'language';
const countryKey = 'country';*/
/*const updatedLatestKey = 'updatedLatest';
const termLocationsKey = 'termLocations';
const safeSearchKey = 'safeSearch';
const fileTypeKey = 'fileType';
const rightsKey = 'rights';
*/

// Some rules about twitter advanced filter
const maxFieldUsages = {

}
// Some fields should not have <= < comparators allowed
const fieldInvalidComparators = {
    //  [numbersRangeKey] : ['eq']
}

// Readables for UI error handling purposes
const comparatorReadable = {
    lte: '≤',
    lt: '<',
    eq: '='

}

// Prevent bad code, with the lack of unit tests
Object.keys(fieldInvalidComparators).forEach((key) => {
    fieldInvalidComparators[key].forEach((value) => {
        if (!comparatorReadable[value])
            throw new Error(`No readable representation for ${key} found`)
    });

})

// The schema we want to search on
let schemaObjects = [new GeneralSearch()] // new Text(), new Images(), new News(), new Shopping()
schemaObjects = [schemaObjects[0]];
const schemas = schemaObjects.map(s => generateSchema(s));

// Map by key 
const fieldsByKey = {};
schemas.forEach((s) => {
    s.fields.forEach((f) => {
        fieldsByKey[f.key as string] = f;
    });
})


function saveState() {
    chrome.storage.sync.set({ lastQuerySession: sess });
}
async function restoreLastSearchQuery() {
    if (!lastSearchField)
        return;
    lastRestoredState = await new Promise(function (resolve) {
        chrome.storage.sync.get('lastQuerySession', function (data) {
            resolve(data.lastQuerySession);
        });
    }) as QuerySession;
    if (!lastRestoredState && hasTypedAnything) {
        return;
    }
    sess = lastRestoredState;
    if(sess.parsedQuery?.searchParams != lastSearchField?.value) // Different tabs or something has changed
    {
        sess = {}
        return; 
    }
    
    const calculatedSearchText = searchFieldTextFromParsedQuery(sess.parsedQuery)
    if (calculatedSearchText == lastSearchField.value) {
        getResult(sess.unparsedQuery);
    }
    else {
        getResult(lastSearchField.value);

    }

}
function restoreSearchFieldText()
{
    if(!insertedLastUnparsedQuery && sess.unparsedQuery)
    {
        insertText(sess.unparsedQuery, true);
        insertedLastUnparsedQuery = true;
    }
}
function navigateSearch(useAdvancedSearch: boolean) {


    saveState();
    if (sess.parsedQuery && useAdvancedSearch) // Only change value if we actually have parsed any query
    {
        // insertText(lastParsedQuery.searchParams, true);
        if (!sess.parsedQuery.searchParams)
            alert('To perform an Advanced Search you need to provide at least one argument of text type, example: "contains apple"')
        else
            navigateToQuery(sess.parsedQuery);
    }
    else {
        // clean up url and tnavigate
        // reset url
        let newUrl = window.location.href;
        if (lastSearchField) {
            const urlObj = new URL(newUrl);
            urlObj.searchParams.set('q', lastSearchField.value);
            urlObj.searchParams.delete('as_q');
            urlObj.searchParams.delete('oq');
            urlObj.searchParams.delete('as_filetype');
            if(urlObj.pathname != urlSearchPath)
            {
                urlObj.pathname = urlSearchPath;
            }
            newUrl = urlObj.toString();
            
        }

        


        if (lastRestoredState) {
            newUrl = decodeURI(newUrl);
            const urlParams = searchQueryParamsByKey(lastRestoredState.parsedQuery);
            const urlObj = new URL(newUrl);
            urlParams.forEach((param,key) => {
                const value = urlObj.searchParams.get(key) ;
                if(value == param || value == encodeURIComponent(param))
                {
                    urlObj.searchParams.delete(key);

                }
            });
            newUrl = urlObj.toString();

            while (newUrl.endsWith('&'))
                newUrl = newUrl.substring(0, newUrl.length - 1);

        }
        window.location.href = newUrl;

    }

    return sess.parsedQuery;
}

const suggestLimit = 10;

// The Quantleaf Query API call
async function getResult(input: string = '') {
    await apiKeySetup;
    const resp = await translate(input, schemaObjects, { query: {}, suggest: { limit: suggestLimit + 1 } }, { nestedConditions: false, concurrencySize: 1 })
    handleResponse(input, resp);
}

// Injects advanced search UI as the first result element
function handleResponse(input: string, responseBody?: QueryResponse) {

    sess.lastResponse = responseBody;
    sess.parsedQuery = {}

 //EnumDomainUtils


    // Suggestions
    const suggestObjects = responseBody?.suggest;
    let suggestions = suggestObjects?.map(s => s.text.trim()).slice(0, Math.min(suggestObjects.length, suggestLimit)).join('</br>');
    lastSuggestions = suggestions;
    printSuggestions();


    // Query
    if (!responseBody || !responseBody.query || responseBody.query.length == 0) {
        noResultsPrint();
        if (!expandedOpenedManually)
            toggleVisuals(false);
        return;
    }
    // Assume unknown serve a purpose
    const unknownAsQuery = parseUnknownQuery(input, responseBody.unknown);

    // Merge in unknown query if applicable
    if (sess.lastResponse && sess.lastResponse.query && unknownAsQuery) {
        if ((sess.lastResponse.query[0].condition as ConditionAnd).and) {
            const and = sess.lastResponse.query[0].condition as ConditionAnd;
            if (!and.and.find((x) => (x as ConditionCompare).compare?.key == allWordsKey)) {
                // Add the implicit query
                and.and.push(unknownAsQuery);
            }

        }
        else if ((sess.lastResponse.query[0].condition as ConditionCompare).compare) {
            const comp = sess.lastResponse.query[0].condition as ConditionCompare;
            if (comp.compare.key != allWordsKey) {
                const mergedCondition: ConditionAnd = {
                    and: [
                        comp,
                        unknownAsQuery
                    ]
                }
                sess.lastResponse.query[0].condition = mergedCondition;
            }
        }
    }

    if (sess.lastResponse?.query && sess.lastResponse.query[0]?.condition) {
        sess.parsedQuery = parseQueryResponse(sess.lastResponse.query[0].condition as (ConditionAnd | ConditionCompare));
    }

    // Readable
    sess.lastReadableQuery = sess.lastResponse ? parseReadableQuery(sess.lastResponse) : undefined;
    if (sess.lastReadableQuery)
        resultPrint(sess.lastReadableQuery)
    else
        noResultsPrint()
}
function resultPrint(readable:string)
{
    textContainer.innerHTML = readable;
}


function noResultsPrint()
{
    textContainer.innerHTML = 'No results';

}

function toggleVisuals(showExpanded: boolean, force?: boolean) {

    if (expanded == showExpanded && initializedUI)
        return;
    initializedUI = true;

    if (expanded && !showExpanded && sess.lastReadableQuery && !force) {
        return; // We have something to show!
    }
    expanded = showExpanded;

    if (formInputParent) {
        if (formInputParent.lastChild != advancedSearchElementWrapper) {
            formInputParent.appendChild(advancedSearchElementWrapper);
        }

        if (!showExpanded) {
            if (advancedSearchElement.firstChild == expandedContainer)
                advancedSearchElement.removeChild(expandedContainer);
            advancedSearchElement.appendChild(minimizedContainer);
        }
        else {

            printSuggestions();
            if (advancedSearchElement.firstChild == minimizedContainer)
                advancedSearchElement.removeChild(minimizedContainer);
            advancedSearchElement.appendChild(expandedContainer);
        }



    }
    setScrollStyle();
}
/*
function insertHidden() {
    insertText('‎', false) // trigger change 

}*/
function insertText(text?: string, clear?: boolean) {
    if (lastSearchField) {
        (lastSearchField as HTMLInputElement).focus();
        if (clear)
            lastSearchField.value = '';
        document.execCommand('insertText', false, text);
        lastSearchField.dispatchEvent(new Event('change', { bubbles: true })); // usually not needed
    }

}

function searchFieldTextFromParsedQuery(parsedQuery?: ParsedQuery) {
    if (!parsedQuery)
        return undefined;
    return (parsedQuery.searchParamsPre ? parsedQuery.searchParamsPre : '') + parsedQuery.searchParams as string;
}

function searchQueryParamsByKey(parsedQuery?: ParsedQuery):Map<string,string> {
    if (!parsedQuery?.queryParams)
        return new Map();
    const groups = new Map<string,string[]>();
    parsedQuery?.queryParams.forEach((q)=>
    {
        let arr = groups.get(q.key);
        if(!arr)
        {
            arr = [];
            groups.set(q.key,arr);
        }
        arr.push(q.value);
    });
    const groupsJoined = new Map<string,string>();
    groups.forEach((v,k)=>
    {
        groupsJoined.set(k, v.join(','));
    })
    return groupsJoined;
}


function searchQueryParamsFromParsedQuery(parsedQuery?: ParsedQuery) {
    const groups = searchQueryParamsByKey(parsedQuery);
    const urlParams:string[] = [];
    groups.forEach((v,k)=>
    {
        urlParams.push(`${k}=${v}`);
    })
    const par =  urlParams.join('&');
    if(par.length > 0)
        return '&' + par;
    return par;
}

function navigateToQuery(parsedQuery: ParsedQuery) {
    const searchQuery = searchFieldTextFromParsedQuery(parsedQuery);
    const urlParams = searchQueryParamsFromParsedQuery(parsedQuery);
    const toEncode = `https://${window.location.hostname}${urlSearchPath}?q=${searchQuery}${urlParams}`;
    const request = toEncode
    window.location.href = request;

}




function printSuggestions() {
    tip.innerHTML = showSuggestions ? hideKeyswWordsHTML : showKeyswWordsHTML;
    if (showSuggestions) {
        suggestionsContainer.innerHTML = `Suggestions</br><i>${lastSuggestions}</i>`;

    }
    else {
        suggestionsContainer.innerHTML = '';
    }
}



// Readable representation of the query object

function parseReadableQuery(response: QueryResponse) {
    let condition: ConditionElement = null as any;
    if (response?.query && response.query.length > 0) {
        condition = response.query[0].condition;
    }

    const ordinaryReadableQuery = parseReadableOrdinaryQuery(condition as (ConditionAnd | ConditionCompare));
    const numberRangeQuery = parseReadableNumberRangeCondition(condition as (ConditionAnd | ConditionCompare));
    const ret: string[] = [];
    if (ordinaryReadableQuery)
        ret.push(ordinaryReadableQuery);
    if (numberRangeQuery)
        ret.push(numberRangeQuery);
    return ret.join('\n');
}

function parseUnknownQuery(input: string, unknown?: Unknown[]): ConditionCompare | null {
    // check if starts with unknown, in that case, us it as a query!
    if (!unknown)
        return null;
    for (let i = 0; i < unknown.length; i++) {
        const u = unknown[i];
        if (u.offset == 0 && u.length > 2) {
            let value = input.substring(u.offset, u.offset + u.length);
            if(value.startsWith("\"") && value.endsWith("\""))
            {
                value = value.substring(1, value.length-1);
            }
            return {
                compare:
                {
                    key: allWordsKey,
                    eq: value
                }
            }

        }

    }
    return null;
}
function parseReadableOrdinaryQuery(condition: (ConditionAnd | ConditionCompare)) {
    if ((condition as ConditionAnd).and) {
        const and: string[] = [];
        (condition as ConditionAnd).and.forEach((element) => {
            const compare = parseReadableOrdinaryQuery(element as (ConditionAnd | ConditionCompare));
            if (compare)
                and.push(compare);
        });
        return `${and.join('<br/>')}`;
    }
    if ((condition as ConditionCompare).compare) {
        const compElements: string[] = [];
        const comp = (condition as ConditionCompare).compare;
        if (comp.key == numbersRangeKey || comp.key == unitKey)
            return null;
        compElements.push(firstDescription(fieldsByKey[comp.key].description));
        if (comp.eq) {
            compElements.push(' = ' + formatValue(comp.key, comp.eq));
        }
        else if (comp.gt) {
            compElements.push(' > ' + formatValue(comp.key, comp.gt));
        }
        else if (comp.gte) {
            compElements.push(' ≥ ' + formatValue(comp.key, comp.gte));
        }
        else if (comp.lt) {
            compElements.push(' < ' + formatValue(comp.key, comp.lt));
        }
        else if (comp.lte) {
            compElements.push(' ≤ ' + formatValue(comp.key, comp.lte));
        }
        return compElements.join('');
    }
    return '';
}

function parseReadableNumberRangeCondition(condition: (ConditionAnd | ConditionCompare)) {
    const parsedCondition = parseNumberRangeConditionNumbersAndUnit(condition);
    const oneDescription = firstDescription(fieldsByKey[numbersRangeKey].description)
    if (!parsedCondition.from && !parsedCondition.to)
        return '';
    return `${oneDescription} ${parsedCondition.from != undefined ? parsedCondition.from + ' ' : ''}to ${parsedCondition.to != undefined ? parsedCondition.to : ''}${parsedCondition.unit ? ' ' + parsedCondition.unit : ''}`;

}
function parseNumberRangeConditionNumbersAndUnit(condition: (ConditionAnd | ConditionCompare)): { from?: number, to?: number, unit?: string } {
    const ret: { from?: number, to?: number, unit?: string } = {};
    let and = (condition as ConditionAnd).and;
    if ((condition as ConditionCompare).compare) {
        and = [(condition as ConditionCompare)];
    }
    and.forEach((condition) => {
        const compare = (condition as ConditionCompare).compare;
        switch (compare.key) {
            case unitKey:
                {
                    ret.unit = String(compare.eq);
                    break;
                }
            case numbersRangeKey:
                {


                    if (compare.gt != undefined) {
                        ret.from = compare.gt;
                        break;

                    }
                    if (compare.gte != undefined) {
                        ret.from = compare.gte;
                        break;

                    }
                    if (compare.lt != undefined) {
                        ret.to = compare.lt;
                        break;

                    }

                    if (compare.lte != undefined) {
                        ret.to = compare.lte;
                        break;

                    }
                    if (ret.from == undefined && ret.to == undefined && compare.eq != undefined) {
                        ret.from = compare.eq as number
                        ret.to = compare.eq as number;
                        break;
                    }

                    if (compare.eq != undefined) {
                        const n = compare.eq as number;
                        if (ret.from != undefined && n < ret.from) {
                            ret.to = ret.from;
                            ret.from = n;
                        }
                        else if (ret.to != undefined && n > ret.to) {
                            ret.from = ret.to;
                            ret.to = n;
                        }
                        else if (ret.from != undefined) {
                            ret.from = n;
                        }
                        else if (ret.to != undefined) {
                            ret.to = n;
                        }
                        break;
                    }
                }
        }
    })
    return ret;

}






function parseQueryResponse(condition: (ConditionCompare | ConditionAnd)): ParsedQuery {
    if (!condition)
        return {};

    const ordinaryConditions = parseOrdinaryConditions(condition);
    const dateConditions = parseDateConditions(condition);
    const numberRangeCondition = parseNumberRangeCondition(condition);
    return mergeParsedQueries([ordinaryConditions, dateConditions, numberRangeCondition])
}

function parseNumberRangeCondition(condition): ParsedQuery {
    const parsedCondition = parseNumberRangeConditionNumbersAndUnit(condition)
    if (parsedCondition.to == undefined && parsedCondition.from == undefined)
        return {};
    return {
        searchParams: `${parsedCondition.from != undefined ? parsedCondition.from : ''}...${parsedCondition.to != undefined ? parsedCondition.to : ''}${parsedCondition.unit ? ' ' + parsedCondition.unit : ''}`
    };
}

function mergeParsedQueries(queries: ParsedQuery[]): ParsedQuery {
    const searchParamsBuilder: string[] = [];
    const queryParamsBuilder: any[] = [];
    const searcParamsPreBuilder: string[] = [];

    queries.forEach((q) => {
        if (!q)
            return;
        if (q.searchParams) {
            searchParamsBuilder.push(q.searchParams);
        }
        if (q.queryParams) {
            queryParamsBuilder.push(...q.queryParams);
        }
        if (q.searchParamsPre) {
            searcParamsPreBuilder.push(q.searchParamsPre);
        }

    })
    return {
        searchParams: searchParamsBuilder.join(' '),
        queryParams: queryParamsBuilder,
        searchParamsPre: searcParamsPreBuilder.join(' ')
    }

}

function parseDateConditions(condition: (ConditionAnd | ConditionCompare)): ParsedQuery {
    const dateConditions: string[] = [];
    let and = (condition as ConditionAnd).and;
    if ((condition as ConditionCompare).compare) {
        and = [(condition as ConditionCompare)];

    }
    and.forEach((condition) => {
        const comp = (condition as ConditionCompare).compare;
        if (comp.key == dateKey) {
            let dateCondition = '';
            if (comp.eq) {
                dateCondition = `cd_min:${formatDate(comp.eq)},cd_max:${formatDate(comp.eq)}`;
            }
            if (comp.lt) {
                dateCondition = `cd_max:${formatDate(dayBefore(comp.lt))}`;
            }
            if (comp.lte) {
                dateCondition = `cd_max:${formatDate(comp.lte)}`;
            }
            if (comp.gt) {
                dateCondition = `cd_min:${formatDate(dayAfter(comp.gt))}`;
            }
            if (comp.gte) {
                dateCondition = `cd_min:${formatDate(comp.gte)}`;
            }
            dateConditions.push(dateCondition);

        }

    });
    if (dateConditions && dateConditions.length > 0) {
        dateConditions.push('cdr:1');
        return {
            queryParams: dateConditions.map(q => 
                {
                    return {
                        key: 'tbs',
                        value: q
                    }
                })
        };

    }

    return {};
}



function parseOrdinaryConditions(condition: (ConditionElement), fieldCounter = {}): ParsedQuery {
    if (!condition)
        return {};
    if ((condition as ConditionAnd).and) {
        const searchParams: string[] = [];
        const queryParams: any[] = [];
        const searchParamsPre: string[] = [];

        (condition as ConditionAnd).and.forEach((element) => {
            const parseResult = parseOrdinaryConditions(element, fieldCounter);
            if (parseResult.searchParams)
                searchParams.push(parseResult.searchParams);
            if (parseResult.queryParams)
                queryParams.push(...parseResult.queryParams)
            if (parseResult.searchParamsPre)
                searchParamsPre.push(parseResult.searchParamsPre)
        });
        return {
            searchParams: `${searchParams.join(' ')}`,
            queryParams: queryParams,
            searchParamsPre: searchParamsPre.join(' ')
        };
    }
    if ((condition as ConditionCompare).compare) {
        const comp = (condition as ConditionCompare).compare;
        const oneDescription = firstDescription(fieldsByKey[comp.key].description)
        fieldCounter[comp.key] = (fieldCounter[comp.key] ? fieldCounter[comp.key] : 0) + 1;
        if (maxFieldUsages[comp.key] != undefined && fieldCounter[comp.key] > maxFieldUsages[comp.key]) {
            alert(`You can only filter on ${oneDescription} ${maxFieldUsages[comp.key]} time(s)`)
        }

        if (fieldInvalidComparators[comp.key]) {
            const invalidComparators = [...fieldInvalidComparators[comp.key]].filter(comparator => comp[comparator] != undefined);
            if (invalidComparators.length > 0) {
                alert(`You can not filter on ${oneDescription} with a ${comparatorReadable[invalidComparators[0]]} comparator`)

            }

        }

        switch (comp.key) {
            case allWordsKey:
                {
                    return {
                        searchParams: String(comp.eq)
                    }
                }
            case exactPhraseKey:
                {
                    return {
                        searchParams: `"${comp.eq}"`
                    }
                }
            case anyOfKey:
                {
                    return {
                        searchParams: `${wordSplit(comp.eq).join(' OR ')}`
                    }
                }
            case notAnyOfWordsKey:
                {
                    return {
                        searchParams: `${wordSplit(comp.eq).map(word => '-' + word).join(' ')}`
                    }
                }


            case languageKey:
                {
                    return {
                        queryParams: [{
                            key: 'lr',
                            value: String(comp.eq)
                        }]
                    }
                }
            case countryKey:
                {
                    return {
                        queryParams: [{
                            key: 'cr',
                            value: String(comp.eq)
                        }]
                    }
                }
            case websiteKey:
                {
                    return {
                        searchParams: `site:${comp.eq}`
                    }
                }
            case textLocationKey:
                {
                    return {
                        searchParamsPre: `${comp.eq}:`
                    }
                }
            case safeSearchKey:
                {
                    if (comp.eq == 'safe') {
                        return {
                            queryParams: [{
                                key: 'safe',
                                value: 'active'
                            }]
                        }
                    }
                    return {}
                }

            case fileTypeKey:
                {
                    let value = String(comp.eq);
                    if(value.startsWith('.'))
                        value = value.substring(1);
                    
                    return {
                        searchParams: 'fileType:' + value
                    }
                }
            case licenseKey:
                {
                    return {
                        queryParams: [{
                            key: 'tbs',
                            value: 'sur:' + String(comp.eq)
                        }]
                    }
                }
            case resultType:
                {
                    return {
                        queryParams: [{
                            key: 'tbm',
                            value: String(comp.eq)
                        }]
                    }
                }

        }
    }
    return {};

}
function wordSplit(words) {
    if (!words)
        return [];
    return words.replace(/,\s+/g, ",").split(/[\n,\s+]/)
}

function formatDate(ms) {
    const date = new Date(ms);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '/' + day + '/' + year;

}
function dayBefore(ms) {
    var date = new Date(ms);
    date.setDate(date.getDate() - 1);
    return date.getTime();
}

function dayAfter(ms) {
    var date = new Date(ms);
    date.setDate(date.getDate() + 1);
    return date.getTime();
}
function formatValue(key, value) {
    const field = fieldsByKey[key];
    if (field.domain == 'DATE') {
        return formatDate(value);
    }
    if (typeof field.domain != 'string' && field.domain[value]) // Enum domain!
    {
        let desc = firstDescription(field.domain[value]);
        if (desc)
            return desc;
    }

    return value;
}
function firstDescription(desc) {
    if (Array.isArray(desc))
        return desc[0];
    if (desc['ANY'])
        return firstDescription(desc['ANY']);
    for (const key of Object.keys(desc)) {
        const d = firstDescription(desc[key]);
        if (d)
            return d;
    }
    return '';
}

