/* eslint-disable no-restricted-globals */
// This is a Web Worker file where 'self' is the correct global object

self.onmessage = async (event) => {
    const { type, payload } = event.data;
    if (type === 'start') {
        const { url, origin, videoID, selectedLanguage, baseUrl } = payload;
        // The core analysis logic is moved here
        await performAnalysis(url, origin, videoID, selectedLanguage, baseUrl);
    }
};

async function performAnalysis(url, origin, videoID, selectedLanguage, baseUrl) {
    const request_url = `${baseUrl}/execute/stream`;
    console.log('Connecting to SSE endpoint in worker:', request_url);

    try {
        const response = await fetch(request_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'request_header': 'user'
            },
            body: JSON.stringify({ url, origin, videoID, selectedLanguage }),
        });

        if (response.status === 429) {
            const rateLimitData = await response.json();
            self.postMessage({ type: 'rateLimit', payload: rateLimitData });
            return;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error starting analysis stream' }));
            const errorPayload = { message: errorData.detail || `Error starting stream: ${response.statusText}` };
            self.postMessage({ type: 'error', payload: errorPayload });
            return;
        }

        // Signal successful connection to clear rate limit info in the main thread
        self.postMessage({ type: 'connected' });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split('\n\n');
            buffer = events.pop();

            for (const event of events) {
                if (event.startsWith('data: ')) {
                    const dataString = event.substring(6);
                    if (dataString) {
                        try {
                            const data = JSON.parse(dataString);
                            if (data.status === 'progress') {
                                self.postMessage({ type: 'progress', payload: data });
                            } else if (data.status === 'complete') {
                                self.postMessage({ type: 'complete', payload: data.data });
                                return;
                            } else if (data.status === 'error') {
                                self.postMessage({ type: 'error', payload: { message: data.message } });
                                return;
                            }
                        } catch (e) {
                            console.error("Failed to parse SSE event data:", dataString, e);
                            self.postMessage({ type: 'error', payload: { message: "Failed to parse a server event." } });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error in worker analysis:", error);
        self.postMessage({ type: 'error', payload: { message: error.message || "An unknown error occurred in the analysis worker." } });
    }
} 