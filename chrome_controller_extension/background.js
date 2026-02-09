importScripts("apps.js")

const setupOffscreen = async () => {
    console.log('Heartbeat');
    if(await chrome.offscreen.hasDocument())
        return;

    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['DOM_SCRAPING'],
        justification: 'Maintain socket connection for remote control'
    });
}

setupOffscreen();

chrome.alarms.create('keepAlive', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if(alarm.name === 'keepAlive')
        setupOffscreen();
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'COMMAND_RECEIVED')
    {
        chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
            if(tabs.length == 0)
                chrome.tabs.create({ url: "https://www.youtube.com/tv" });
        
            const activeTab = tabs[0];
            const currentPlatform = activeTab.url.split(".")[1];
        
            if(message.action == 'OPEN_TAB')
            {
                const newPlatform = message.url.split(".")[1];
        
                chrome.tabs.update(activeTab.id, { url: message.url });
                apps[newPlatform].reset();
            }

            else if(message.action == 'FULLSCREEN')
            {
                console.log('fullscreen');
                chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, { state: "fullscreen"});
            }

            else if(message.action == 'INPUT')
                apps[currentPlatform].setInput(message.input, activeTab.id);

            else if(message.action == 'SUBMIT')
                apps[currentPlatform].submit(message.input, activeTab.id);

            else if(message.action == 'HANDLE')
                apps[currentPlatform].handle(message.key, activeTab.id);
        });
    }
});