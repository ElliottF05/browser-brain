import { SEND_TEXT_CHUNK, PAGE_UNLOAD, type ContentToBackgroundMessage } from './types';


// ----- STATE MANAGEMENT -----

// store text for each tab, use a set for deduplication
const tabData = new Map<number, { seenTextSet: Set<string>, seenTextList: string[], lastUrl: string }>();


// ----- MESSAGE PROCESSING -----

// helper function to process received text chunks
function processTextChunksReceived(tabId: number, text: string) {
    console.log("Received text chunk in background from tab", tabId);
    if (!tabData.has(tabId)) {
        tabData.set(tabId, { seenTextSet: new Set(), seenTextList: [], lastUrl: '' });
    }
    const data = tabData.get(tabId)!;
    if (!data.seenTextSet.has(text)) {
        data.seenTextSet.add(text);
        data.seenTextList.push(text);
    }
}

async function processPageUnload(tabId: number, url: string) {
    const data = tabData.get(tabId);
    if (!data) {
        console.warn(`No data found for tab ${tabId} on unload, returning early.`);
        return;
    }

    console.log(`Page unloaded: ${url}`);
    
    // send collected data to backend
    const payload = {
        url: url,
        content: data.seenTextList,
        user_id: 'user123' // TODO: replace with actual user ID
    }

    // TODO: replace with actual backend URL
    const response = await fetch('http://127.0.0.1:8000/pages/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
        console.error("Failed to upload page data:", response.statusText, response.status);
    } else {
        console.log("Page data uploaded successfully, response:", await response.json());
    }

    // delete tab data
    tabData.delete(tabId);
}


// ----- REGISTER HANDLERS FOR INCOMING MESSAGES -----

// add handler for incoming text chunks
chrome.runtime.onMessage.addListener(
    (message: ContentToBackgroundMessage, sender, _sendResponse) => {
        const tabId = sender.tab?.id;
        if (tabId === undefined || tabId === null) {
            console.warn("Received message without tab ID, ignoring.");
            return;
        }
        switch (message.type) {
            case SEND_TEXT_CHUNK:
                processTextChunksReceived(tabId, message.data);
            break;
            case PAGE_UNLOAD:
                processPageUnload(tabId, message.url);
                break;
        }
    }
);