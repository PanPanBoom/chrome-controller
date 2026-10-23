import patchright from 'patchright';
import { serverLog } from './utils.js'

export class ScrappingBrowser {
    static #contextPromise = null;
    static #idleTimer = null;

    static async getContext() {
        if (!this.#contextPromise) {
            serverLog("Creating ScrappingBrowser...");
            this.#contextPromise = patchright.chromium.launchPersistentContext('./profile', {
                    channel: 'chrome',
                    headless: false,
                    viewport: { width: 1920, height: 1080 },
                    args: [
                        '--disable-blink-features=AutomationControlled',
                        '--window-position=-32000,-32000'
                    ]
                });
        }

        clearTimeout(this.#idleTimer);
        this.#idleTimer = setTimeout(async () => {
            const context = await this.#contextPromise;
            this.#contextPromise = null;
            await context.close();
        }, 5 * 60_000)

        return this.#contextPromise;
    }

    static async getNewPage() {
        serverLog("Opening new page");
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