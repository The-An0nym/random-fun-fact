import loadFacts from '/data/loader.js';

const factObj = (await loadFacts()).facts;

// Keeps track of previously shown facts
const oldFacts = localStorage.getItem("oldFacts") ? localStorage.getItem("oldFacts").split(",") : []; 
// All the fact IDs
const factIDs = Object.keys(factObj);

/**
 * Space triggers nextFact
 */
document.addEventListener('keyup', (event) => {
    if (event.code === 'Space')
        nextFact();
});

/**
 * Clicking next button triggers nextFact
 */
document.getElementById("next").addEventListener("click", () => {
    nextFact();
});

/**
 * Clicking previous button shows previous fact
 */
document.getElementById("previous").addEventListener("click", () => {
    const currId = document.getElementById("id").innerText;
    if(oldFacts.length === 0) {
        document.getElementById("previous").className = "disabled";
        return;
    }

    if(!oldFacts.includes(currId)) {
        showFact(oldFacts[oldFacts.length - 1]);
        return;
    }

    const index = oldFacts.indexOf(currId);
    if(index === 0 ) {
        document.getElementById("previous").className = "disabled";
        return;
    }

    if(index === 1) {
        document.getElementById("previous").className = "disabled";
    }

    showFact(oldFacts[index - 1]);
});

if(window.location.href.includes("#")) {
    if(showFact(window.location.href.split("#")[1]) === false)
        nextFact();
} else {
    nextFact();
}


/**
 * Responsible for picking out a new, randomized fact
 */
function nextFact() {
    // Enable previous button
    document.getElementById("previous").className = oldFacts.length === 0 ? "disabled" : "";    

    // Check if all facts have been shown
    if(oldFacts.length >= factIDs.length) {
        localStorage.removeItem("oldFacts");
        oldFacts.length = 0;
        console.warn("Reset fact history");
    }

    // If 75% of facts have been shown, don't randomize
    let newFactId;
    if(oldFacts.length / factIDs.length >= 0.75) {
        for(const id of factIDs) {
            if(!oldFacts.includes(id)) {
                newFactId = id
                break;
            }
        }
    } else {
        do {
            newFactId = factIDs[Math.floor(Math.random() * factIDs.length)];
        } while(oldFacts.includes(newFactId));
    }

    showFact(newFactId);
}

/**
 * Displays a fact on the page by ID
 * @param {string} id - Fact ID
 * @returns {boolean} success
 */
function showFact(id) {
    console.log("Showing fact ID:", id);
    storeFact(id);

    if(id === undefined || factObj[id] === undefined)
        return false;

    const factData = factObj[id];

    document.getElementById("fact").innerText = factData.fact;
    document.getElementById("tags").innerText = factData.tags.join(", ");
    document.getElementById("source").href = factData.source;
    document.getElementById("source").innerText = factData.source.split("/")[2];
    document.getElementById("id").innerText = id;

    return true;
}

/**
 * Stores a given fact by ID in localStorage
 * @param {string} id - Fact ID
 */
function storeFact(id) {
    if(!oldFacts.includes(id))
        oldFacts.push(id);
    localStorage.setItem("oldFacts", oldFacts.join(","));
}