importScripts("socket.io.min.js", "apps.js");

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
    chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
        if(tabs.length == 0)
            chrome.tabs.create({ url: "https://www.youtube.com/tv" });

        const activeTab = tabs[0];

        if(data.action == 'OPEN_TAB')
            chrome.tabs.update(activeTab.id, { url: data.url });

        else if(data.action == 'KEY_PRESS')
            pressKey(data.key)

        else if(data.action == 'VALIDATION')
        {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: () => document.activeElement.click()
            })
        }

        else if(data.action == "GO_BACK")
        {
            console.log("j'essaye là");
            chrome.tabs.goBack(activeTab.id, () => {
                if(chrome.runtime.lastError)
                    console.log("Impossible de go back");
            })
        }

        else if(data.action == 'NAVIGATE')
        {
            const currentPlatform = activeTab.url.split(".")[1];

            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                args: [ data.key.toLowerCase(), apps[currentPlatform] ],
                func: (key, selectors) => {
                    const rows = Array.from(document.querySelectorAll(selectors.rowSelector));
                    const rowsWithItems = rows.map((row) => Array.from(row.querySelectorAll(selectors.itemsSelector)));
                    const allItems = Array.from(document.querySelectorAll(selectors.itemsSelector));
                    console.log(rowsWithItems);

                    // rowsWithItems[4][3].focus();

                    let x = -1, y = -1;

                    rowsWithItems.forEach((row, index) => {
                        const activeElementIndex = row.indexOf(document.activeElement);
                        console.log(activeElementIndex);
                        if(activeElementIndex >= 0)
                        {
                            x = activeElementIndex;
                            y = index;
                        }
                    });

                    if(x < 0 || y < 0)
                        rowsWithItems[0][0].focus();
                    else
                    {
                        if(key.includes("up")) {
                            y--;
                            x = 0;
                        } else if(key.includes("down")){ 
                            y++;
                            x = 0;
                        } else if(key.includes("left")) x--;
                        else if(key.includes("right")) x++;

                        rowsWithItems[y][x].focus();
                    }

                    document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    allItems.forEach(items => items.style.outline = '');
                    document.activeElement.style.outline = "3px solid white";
                    document.activeElement.style.borderRadius = "4px";

                    // rows[5].focus();
                    // rows[5].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            })
        }
    });
})