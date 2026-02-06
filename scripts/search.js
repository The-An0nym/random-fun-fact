import loadFacts from '/data/loader.js';

const factObj = {};
const selectedTags = new Set();

loadFacts().then(data => {
    const factIDs = Object.keys(data.facts);
    for(const id of factIDs) {
        factObj[id] = data.facts[id];
    }
    appendTags(data);
});

document.getElementById("search-input").addEventListener("input", search);

function appendTags(data) {
    const tagWrapper = document.getElementById("tags-container");

    for(const tag of data.tags) {
        const tagButton = document.createElement("button");
        tagButton.className = "tag";
        tagButton.innerText = tag;
        tagButton.addEventListener("click", () => {
            if(selectedTags.has(tag)) {
                selectedTags.delete(tag);
                tagButton.className = "tag";
            } else {
                selectedTags.add(tag);
                tagButton.className = "tag selected";
            }
            search();
        });
        tagWrapper.appendChild(tagButton);
    }

    appendResults(Object.keys(data.facts));
}

function search() {
    const allIDs = Object.keys(factObj);
    const resultIDs = [];

    const searchTerms = document.getElementById("search-input").value.toLowerCase().split(" ").filter(term => term.trim() !== "");
    if(searchTerms.length === 0 && selectedTags.size === 0) {
        appendResults(allIDs);
        return;
    }

    for(const id of allIDs) {
        const fact = factObj[id];
        const factText = fact.fact.toLowerCase();
        if(!fact.tags.some(tag => selectedTags.has(tag)) && selectedTags.size > 0)
            continue;
            
        if(searchTerms.every(term => factText.includes(term)) || searchTerms.length === 0)
            resultIDs.push(id);
    }

    appendResults(resultIDs);
}

function appendResults(factIDs) {
    const resultsWrapper = document.getElementById("results-wrapper");
    resultsWrapper.innerHTML = "";
    
    if(factIDs.length === 0) {
        resultsWrapper.innerHTML = "No facts found";
        return;
    }

    for(const factID of factIDs) {
        const fact = factObj[factID];
        const factWrapper = document.createElement("div");
        factWrapper.className = "fact-wrapper";


        const factElement = document.createElement("div");
        factElement.innerText = fact.fact;
        factElement.className = "fact";

        const factDetails = document.createElement("div");
        factDetails.className = "fact-details";
        
        const factIDElement = document.createElement("span");
        factIDElement.innerText = factID;
        factDetails.appendChild(factIDElement);
        
        const factTags = document.createElement("span");
        factTags.innerText = fact.tags.join(", ");
        factDetails.appendChild(factTags);
        
        const factSource = document.createElement("a");
        factSource.href = fact.source;
        factSource.innerText = fact.source.split("/")[2];
        factDetails.appendChild(factSource);


        factWrapper.appendChild(factElement);
        factWrapper.appendChild(factDetails);
        
        resultsWrapper.appendChild(factWrapper);
    }
}

