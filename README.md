# Natural Advanced Search for Google™
Make Google Search fields auto detect search that resembles "advanced search" and perform them. Advanced search is currently today accessible through the advanced search UI in a combination with their own syntax. This extension combines both into a natural language experience.
![Demo search](/../master/snap2.png?raw=true)

## How to use
Install from the XXX or clone the repo and use this as a development extension.
If you type in a search field and get a matching advanced search suggestion you press (ctrl) + (enter) to use it.
You can toggle suggestions and keywords with (ctrl) + (space).


## How it works
It uses [query.quantleaf.com](https://query.quantleaf.com) under the hood to convert natural languages to the advanced search format. See the file *advanced-search-schema.ts* and *inject.ts* to learn about how it was implemented for this tool.

 
<br/>
<br/>

**Enjoy! 😎**

// Marcus