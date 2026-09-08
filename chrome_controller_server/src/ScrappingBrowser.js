import patchright from 'patchright';

export class ScrappingBrowser {
    static #contextPromise = null;

    static async getContext() {
        if (!this.#contextPromise) {
            console.log("Creating ScrappingBrowser...");
            this.#contextPromise = (async () => {
                const browser = await patchright.chromium.launch({
                    channel: 'chrome',
                    headless: false,
                    args: [
                        '--headless=new',
                        '--disable-blink-features=AutomationControlled'
                    ]
                });

                const context = await browser.newContext({
                    viewport: { width: 1920, height: 1080 },
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
                });

                return context;
            })();
        }
        return await this.#contextPromise;
    }

    static async getNewPage() {
        console.log("Opening new page");
        const context = await this.getContext();
        return await context.newPage();
    }

    static async getCookieString() {
        const context = await this.getContext();
        
        // Attention : .cookies() est une MÉTHODE asynchrone, pas une propriété !
        const cookies = await context.cookies(); 
        
        // On formate les cookies pour pouvoir les envoyer directement dans un header
        return cookies.map(c => `${c.name}=${c.value}`).join('; ');
    }

    static async close()
    {
        if(this.#contextPromise)
        {
            const context = await this.#contextPromise;

            await context.browser().close();

            this.#contextPromise = null;
        }
    }
}