import { type TextChunkMessage, type PageUnloadMessage, SEND_TEXT_CHUNK, PAGE_UNLOAD } from './types';

console.log("Content script loaded");

// ----- STATE -----
// set to keep track of elements already seen and avoid adding duplicates
const seenElements = new Set<Element>();


// ----- INTERSECTION OBSERVER LOGIC -----

// callback function for the IntersectionObserver
function handleIntersect(entries: IntersectionObserverEntry[]) {
	for (const entry of entries) {
		if (entry.isIntersecting && !seenElements.has(entry.target)) {
			const text = removeRedundantWhitespace(getVisibleTextFromElement(entry.target));
			if (text) {
				sendTextChunkToBackground(text);
				seenElements.add(entry.target);
				console.log("Visible text added: ", text);
			}
		}
	}
}

// set up the IntersectionObserver instance
const intersectionObserver = new IntersectionObserver(handleIntersect, { threshold: 0.1 });

// use a MutationObserver to watch for DOM changes
// and rerun observeVisibleText
const mutationObserver = new MutationObserver(() => {
    observeVisibleText();
});
mutationObserver.observe(document.body, { childList: true, subtree: true });

// use the IntersectionObserver API to observe elements that enter the viewport
function observeVisibleText() {
    const textElementTypes = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section, span');
    textElementTypes.forEach(el => intersectionObserver.observe(el));
}

// initial run
observeVisibleText();


// ----- TEXT EXTRACTION HELPERS -----

// helper function to get visible text from an element
function getVisibleTextFromElement(el: Element): string {
	// omit elements that are not visible
	const style = window.getComputedStyle(el);
	if (style.display === 'none' || style.visibility === 'hidden') {
		return '';
	}
	return el.textContent?.trim() || '';
}

// helper function to remove redundant/duplicate whitespace
function removeRedundantWhitespace(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}


// ----- BACKGROUND COMMUNICATION -----

// send text chunks to the background script
function sendTextChunkToBackground(text: string) {
	const message: TextChunkMessage = {
		type: SEND_TEXT_CHUNK,
		data: text,
	};
	chrome.runtime.sendMessage(message);
}


// ----- PAGE UNLOAD NOTIFICATION -----

// notify background script on page unload (navigation, redirect, etc.)
window.addEventListener('beforeunload', () => {
	const message: PageUnloadMessage = {
		type: PAGE_UNLOAD,
		url: window.location.href,
	};
	chrome.runtime.sendMessage(message);
});