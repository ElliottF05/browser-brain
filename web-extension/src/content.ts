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

// set to keep track of elements already seen and avoid adding duplicates
const seenElements = new Set<Element>();
const visibleTextChunks: string[] = [];

// callback function for the IntersectionObserver
function handleIntersect(entries: IntersectionObserverEntry[]) {
	for (const entry of entries) {
		if (entry.isIntersecting && !seenElements.has(entry.target)) {
			const text = removeRedundantWhitespace(getVisibleTextFromElement(entry.target));
			if (text) {
				visibleTextChunks.push(text);
				seenElements.add(entry.target);
				console.log(`Visible text added: ${text}`);
			}
		}
	}
	// optionally, send updates to background script as you go
	// chrome.runtime.sendMessage({
	// 	type: 'VISIBLE_TEXT_UPDATE',
	// 	url: window.location.href,
	// 	text: visibleTextChunks.join('\n'),
	// });
}

// use the IntersectionObserver API to observe elements that enter the viewport
function observeVisibleText() {
	const observer = new IntersectionObserver(handleIntersect, {
		root: null,
		threshold: 0.1, // test this value
	});
	
	// observe all text-containing elements
	// check this list of elements, might need to change it
	const textElementTypes = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, article, section');
	textElementTypes.forEach(elemType => observer.observe(elemType));
}

// start the observer
observeVisibleText();