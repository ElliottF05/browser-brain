import { SEND_TEXT_CHUNK, PAGE_UNLOAD, type ContentToBackgroundMessage } from './types';


// ----- STATE MANAGEMENT -----

// store text on the current page, use a set for deduplication
const seenTextSet = new Set<string>();
const seenTextList: string[] = [];


// ----- MESSAGE PROCESSING -----

// helper function to process received text chunks
function processTextChunksReceived(text: string) {
    console.log("Received text chunk in background");
    if (!seenTextSet.has(text)) {
        seenTextSet.add(text);
        seenTextList.push(text);
    }
}

function processPageUnload(url: string) {
    console.log(`Page unloaded: ${url}`);
    
    // send collected data to backend
    const text = seenTextList.join('\n');
    // backend.sendTextChunks(text);

    // clear the seen text set and list for the next page
    seenTextSet.clear();
    seenTextList.length = 0;
}


// ----- REGISTER HANDLERS FOR INCOMING MESSAGES -----

// add handler for incoming text chunks
chrome.runtime.onMessage.addListener(
    (message: ContentToBackgroundMessage, _sender, _sendResponse) => {
        switch (message.type) {
            case SEND_TEXT_CHUNK:
                processTextChunksReceived(message.data);
            break;
            case PAGE_UNLOAD:
                processPageUnload(message.url);
                break;
        }
    }
);