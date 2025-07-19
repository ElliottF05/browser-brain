// ----- GENERAL CONSTANTS -----

export const SAMPLE_USER_ID = "730a28be-7283-457b-895b-6df9aaf32f97";
export const BASE_URL = "http://127.0.0.1:8000";


// ----- GENERAL TYPES -----

export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    isTyping?: boolean;
};


// ----- CONTENT/INSTANCE --> BACKGROUND EVENTS -----

export const TEXT_CHUNK_RECEIVED = 'TEXT_CHUNK_RECEIVED' as const;
export const PAGE_UNLOAD = 'PAGE_UNLOAD' as const;
export const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED' as const;
export const REQUEST_CHAT_HISTORY = 'REQUEST_CHAT_HISTORY' as const;

export type InstanceToBackgroundEvent = TextChunkReceivedEvent
    | PageUnloadEvent 
    | ChatMessageReceivedEvent 
    | RequestChatHistoryEvent;

export interface TextChunkReceivedEvent {
    type: typeof TEXT_CHUNK_RECEIVED;
    data: string;
    url: string;
}
export interface PageUnloadEvent {
    type: typeof PAGE_UNLOAD;
    url: string;
}
export interface ChatMessageReceivedEvent {
    type: typeof CHAT_MESSAGE_RECEIVED;
    message: ChatMessage;
}
export interface RequestChatHistoryEvent {
    type: typeof REQUEST_CHAT_HISTORY;
}


// ----- BACKGROUND --> CONTENT/INSTANCE EVENTS -----

export const CHAT_HISTORY_UPDATE = 'CHAT_HISTORY_UPDATE' as const;

export type BackgroundToInstanceEvent = ChatHistoryUpdateEvent;

export interface ChatHistoryUpdateEvent {
    type: typeof CHAT_HISTORY_UPDATE;
    messages: ChatMessage[];
}