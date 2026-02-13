const socket = io("http://localhost:3000", {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log("Connecté au serveur");
    socket.emit("identify", "extension");
});

socket.on('command', (data) => {
    chrome.runtime.sendMessage({
        type: 'COMMAND_RECEIVED',
        action: data.action,
        key: data.key,
        url: data.url,
        input: data.input
    });
});