importScripts("apps.js")

const setupOffscreen = async () => {
    if(await chrome.offscreen.hasDocument())
        return;

    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['DOM_SCRAPING'],
        justification: 'Maintain socket connection for remote control'
    });
}

setupOffscreen();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'COMMAND_RECEIVED')
    {
        chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
            console.log(message);
            if(tabs.length == 0)
                chrome.tabs.create({ url: "https://www.youtube.com/tv" });
        
            const activeTab = tabs[0];
        
            if(message.action == 'OPEN_TAB')
            {
                console.log("change l'url")
                const newPlatform = message.url.split(".")[1];
        
                chrome.tabs.update(activeTab.id, { url: message.url });
                apps[newPlatform].reset();
            }
        
            else if(message.action == 'HANDLE')
            {
                const currentPlatform = activeTab.url.split(".")[1];
                
                apps[currentPlatform].handle(message.key, activeTab.id);
            }
        });
    }
});