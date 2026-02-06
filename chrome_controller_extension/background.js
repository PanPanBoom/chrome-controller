importScripts("socket.io.min.js", "apps.js");

const socket = io("http://localhost:3000", {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log("Connecté au serveur");
});

socket.on('command', (data) => {
    chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
        if(tabs.length == 0)
            chrome.tabs.create({ url: "https://www.youtube.com/tv" });

        const activeTab = tabs[0];

        if(data.action == 'OPEN_TAB')
        {
            const newPlatform = data.url.split(".")[1];

            chrome.tabs.update(activeTab.id, { url: data.url });
            apps[newPlatform].reset();
        }

        else if(data.action == 'HANDLE')
        {
            const currentPlatform = activeTab.url.split(".")[1];
            
            apps[currentPlatform].handle(data.key, activeTab.id);
        }
    });
})