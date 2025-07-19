import { LRUCache } from 'lru-cache';

import { TEXT_CHUNK_RECEIVED, PAGE_UNLOAD, type InstanceToBackgroundEvent, SAMPLE_USER_ID, type ChatMessage, BASE_URL, CHAT_MESSAGE_RECEIVED, CHAT_HISTORY_UPDATE, REQUEST_CHAT_HISTORY } from './types';

import './popup/injector'


// ----- STATE MANAGEMENT -----

// store text for each tab, use a set for deduplication
const tabData = new Map<number, { seenTextList: string[], textSize: number, opened_ts: number }>();
const globalSet = new LRUCache<string, string>({
    max: 10000, // maximum number of unique text chunks to store globally
    maxSize: 5000 * 1024, // maximum size of the cache, 5mb
    sizeCalculation: (value) => value.length, // size is based on string length
});

let chatHistory: ChatMessage[] = [];


// ----- EVENT PROCESSING -----

// helper function to process received text chunks
async function processTextChunksReceived(tabId: number, text: string, url: string) {
    console.log("Received text chunk in background from tab", tabId);
    if (globalSet.has(text)) {
        console.log("Text chunk already seen globally, skipping:", text);
        return;
    }
    globalSet.set(text, text); // add to global set to avoid duplicates
    if (!tabData.has(tabId)) {
        tabData.set(tabId, { seenTextList: [], textSize: 0, opened_ts: Date.now() });
    }
    const data = tabData.get(tabId)!;
    data.seenTextList.push(text);
    data.textSize += text.length;

    if (data.textSize > 1024 * 8) {
        console.log(`Tab ${tabId} has accumulated enough text data, uploading...`);
        const dataToSend = data.seenTextList.slice();
        data.seenTextList.length = 0;
        data.textSize = 0;
        await uploadPageData(url, dataToSend);
    }
}

async function processPageUnload(tabId: number, url: string) {
    console.log("Processing page unload for url", url);
    const data = tabData.get(tabId);
    if (!data) {
        console.warn(`No data found for tab ${tabId} on unload, returning early.`);
        return;
    }
    if (data.seenTextList.length === 0) {
        console.log(`No text data collected for tab ${tabId}, skipping upload.`);
        return;
    }
    if (Date.now() - data.opened_ts < 5000) {
        console.warn(`Tab ${tabId} was opened less than 5 seconds ago, skipping upload.`);
        return;
    }

    console.log(`Page unloaded: ${url}`);
    
    // send collected data to backend
    await uploadPageData(url, data.seenTextList);

    // delete tab data
    tabData.delete(tabId);
}

function processChatMessageReceived(message: ChatMessage) {
    console.log("Received chat message:", message);
    chatHistory.push(message);
    broadcastChatHistoryUpdate();
}

function processRequestChatHistory(sendResponse: (response: any) => void) {
    console.log("Received request for chat history");
    sendResponse({ messages: chatHistory });
}


// ----- BACKEND COMMUNICATION HELPERS -----

async function uploadPageData(url: string, content: string[]) {
    console.log("Uploading page data to backend");
    const payload = {
        url: url,
        content: content,
        user_id: SAMPLE_USER_ID // TODO: replace with actual user ID
    };

    const response = await fetch(`${BASE_URL}/pages/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error("Failed to upload page data:", response.statusText, response.status);
    } else {
        console.log("Page data uploaded successfully, response:", await response.json());
    }
}


// ----- REGISTER HANDLERS FOR INCOMING MESSAGES -----

// add handler for incoming events
chrome.runtime.onMessage.addListener(
    (message: InstanceToBackgroundEvent, sender, sendResponse) => {
        const tabId = sender.tab?.id;
        if (tabId === undefined || tabId === null) {
            console.warn("Received message without tab ID, ignoring.");
            return;
        }
        switch (message.type) {
            case TEXT_CHUNK_RECEIVED:
                processTextChunksReceived(tabId, message.data, message.url);
            break;
            case PAGE_UNLOAD:
                processPageUnload(tabId, message.url);
                break;
            case CHAT_MESSAGE_RECEIVED:
                processChatMessageReceived(message.message);
                break;
            case REQUEST_CHAT_HISTORY:
                processRequestChatHistory(sendResponse);
                break;
        }
    }
);


// ----- CHAT MESSAGE HELPERS -----

async function getChatMessageHistory() {
    console.log("Fetching chat message history from backend");
    const response = await fetch(
        `${BASE_URL}/chat/messages`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        }
    );
    if (!response.ok) {
        console.error("Failed to fetch chat history:", response.statusText, response.status);
        return [];
    }
    const data = await response.json();
    const messages = data.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
    }))
    return messages;
}

function broadcastChatHistoryUpdate() {
    console.log("Broadcasting chat history update to all tabs");
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id!, {
                type: CHAT_HISTORY_UPDATE,
                messages: chatHistory,
            });
        });
    });
}


// ----- ON STARTUP -----

async function loadInitialChatHistory() {
    chatHistory = await getChatMessageHistory();
    console.log(chatHistory);
    broadcastChatHistoryUpdate();
}
loadInitialChatHistory();


