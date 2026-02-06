const socket = io("http://localhost:3000", {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log("Connecté au serveur");
});

socket.on('command', (data) => {
    console.log('offscreen: command received ' + data.action)
    chrome.runtime.sendMessage({
        type: 'COMMAND_RECEIVED',
        action: data.action,
        key: data.key,
        url: data.url
    });
});