// Constant for frame ID
const FRAME_ID = 'extension-frame';

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked');
    
    chrome.scripting.executeScript({
        target: { tabId: tab.id! },

        // use function parameter to avoid duplicate FRAME_ID definition
        func: (frameID) => {
            console.log("Executing script to inject frame with ID:", frameID);

            // declaring the click and keydown handlers
            const clickHandler = (e: MouseEvent) => {
                const frame = document.getElementById(frameID);
                if (frame && !frame.contains(e.target as Node)) {
                    removeFrame();
                }
            };

            const keyHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    removeFrame();
                }
            };

            // function to remove the extension frame and its event listeners
            function removeFrame() {
                const frame = document.getElementById(frameID);
                if (frame) {
                    frame.remove();
                    document.removeEventListener(
                        'click',
                        clickHandler
                    );
                    document.removeEventListener(
                        'keydown',
                        keyHandler
                    );
                }
            }
            
            // remove existing frame if it exists
            const existingFrame = document.getElementById(frameID);
            if (existingFrame) {
                removeFrame();
                console.log("Frame already exists, removing");
                return;
            }
            
            // create iframe for extension popup
            const iframe = document.createElement('iframe');
            iframe.id = frameID;
            
            // Apply the following CSS properties.
            // Some properties are critical for the extension's display, while others are optional for aesthetics.
            // They currently do not use !important, but you can add !important if needed to override page styles.
        //     iframe.style.cssText = `
        //   /* ====== Positioning ====== */
        //   /* Necessary: Use fixed positioning so the iframe stays in the viewport even when scrolling */
        //   position: fixed;
        //   /* Necessary: Position the iframe 5px from the right edge of the viewport */
        //   right: 5px;
        //   /* Necessary: Position the iframe 5px from the top of the viewport */
        //   top: 5px;
        //   /* Necessary: Ensure the iframe is above all other elements. The value is set extremely high */
        //   z-index: 2147483647;
        //   /* ====== Sizing ====== */
        //   /* Optional: Set the height of the iframe. Adjust based on your UI needs. */
        //   height: 400px;
        //   /* Optional: Set the width of the iframe. Adjust based on your UI needs. */
        //   width: 300px;
        //   /* ====== Appearance ====== */
        //   /* Optional: Remove any default border for a cleaner look */
        //   border: none;
        //   /* Optional: Set the background to transparent. This might be required if the iframe content has its own styling */
        //   /* Optional: Remove any default margin that may be applied */
        //   margin: 0;
        //   /* Optional: Remove any default padding that may be applied */
        //   padding: 0;
        //   /* ====== Visibility ====== */
        //   /* Optional: Ensure the iframe is rendered as a block element, which is useful for layout consistency */
        //   display: block;
        //   /* Optional: Explicitly set the iframe to be visible. This is generally the default */
        //   visibility: visible;
        //   /* Optional: Set the opacity to fully opaque. This is generally the default */
        //   opacity: 1;
        //   /* ====== Color Scheme ====== */
        //   /* Necessary: Force the iframe to always use the light color scheme, even in dark mode */
        //   color-scheme: light;
        // `;
            iframe.style.position = "fixed";
            iframe.style.right = "5px";
            iframe.style.top = "5px";
            iframe.style.zIndex = "2147483647"; // very high z-index to ensure it appears above all other elements 
            iframe.style.height = "400px"; // adjust based on your UI needs
            iframe.style.width = "300px"; // adjust based on your UI needs 
            iframe.style.border = "none"; // remove default border
            iframe.style.margin = "0"; // remove default margin
            iframe.style.padding = "0"; // remove default padding
            iframe.style.display = "block"; // render as block element
            iframe.style.visibility = "visible"; // ensure it is visible
            iframe.style.opacity = "1"; // fully opaque
            iframe.style.colorScheme = "light"; // force light color scheme
            iframe.style.borderRadius = "16px"; // ROUNDED CORNERS

            iframe.style.background = "black";

            // set the source of the iframe to the extension's popup html
            iframe.src = chrome.runtime.getURL('src/popup/popup.html');
            
            // add iframe to the page
            document.body.appendChild(iframe);
            
            // add event listeners with a slight delay to avoid immediate removal
            setTimeout(() => {
                document.addEventListener('click', clickHandler);
                document.addEventListener('keydown', keyHandler);
            }, 100);
        },
        args: [FRAME_ID]
    })
    .then(() => {
        console.log('Script injected successfully');
    })
    .catch((err) => {
        console.error('Failed to inject script:', err);
    });
});