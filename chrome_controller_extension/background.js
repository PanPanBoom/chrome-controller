importScripts("socket.io.min.js");

const socket = io("http://localhost:3000", {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log("Connecté au serveur");
});

const pressKey = (key) => {
    const keyCodeMap = {
        'ArrowLeft': 37,
        'ArrowUp': 38,
        'ArrowRight': 39,
        'ArrowDown': 40,
        ' ': 32,
        'f': 70,
        'Enter': 13,
        'Tab': 9
    };

    chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
            if(!tabs[0])
                return;

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (keyName) => {
                    window.focus();

                    const createEvent = (type) => new KeyboardEvent(type, {
                        key: keyName,
                        keyCode: keyCodeMap[keyName],
                        code: keyName,
                        which: keyCodeMap[keyName],
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });

                    const down = createEvent('keydown');
                    const press = createEvent('keypress');
                    const up = createEvent('keyup');

                    const target = document.activeElement || document.body

                    target.dispatchEvent(down);
                    if (keyName === 'Enter' || keyName === ' ') {
                        target.dispatchEvent(press);
                    }
                    target.dispatchEvent(up);
                },
                args: [data.key]
            });
        });
}

socket.on('command', (data) => {
    console.log(data.action);
    if(data.action == 'OPEN_TAB')
    {
        chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
            if(tabs.length > 0)
                chrome.tabs.update(tabs[0].id, { url: data.url })
            else
                chrome.tabs.create({ url: data.url })
        })
    }

    else if(data.action == 'KEY_PRESS')
    {
        console.log(data.key);
        pressKey(data.key)
    }
})