/**
 * Loads and returns facts.json
 * @returns {JSON} object
 */
export default async function loadFacts() {
    try {
        const response = await fetch('/data/facts.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading facts:', error);
        return undefined;
    }
}