importScripts("socket.io.min.js");

const socket = io("http://localhost:3000", {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log("Connecté au serveur");
});

socket.on('command', (data) => {
    if(data.action == 'OPEN_TAB')
    {
        chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
            if(tabs.length > 0)
                chrome.tabs.update(tabs[0].id, { url: data.url })
            else
                chrome.tabs.create({ url: data.url })
        })
    }
})