export const SEND_TEXT_CHUNK = 'SEND_TEXT_CHUNK' as const;
export const PAGE_UNLOAD = 'PAGE_UNLOAD' as const;
export const SAMPLE_USER_ID = "730a28be-7283-457b-895b-6df9aaf32f97";

export type ContentToBackgroundMessage = TextChunkMessage | PageUnloadMessage;

export interface TextChunkMessage {
    type: typeof SEND_TEXT_CHUNK;
    data: string;
}

export interface PageUnloadMessage {
    type: typeof PAGE_UNLOAD;
    url: string;
}