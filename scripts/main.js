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
    // Store previous fact
    if(document.getElementById("id"))
        oldFacts.push(document.getElementById("id").innerText);
    localStorage.setItem("oldFacts", oldFacts.join(","));

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