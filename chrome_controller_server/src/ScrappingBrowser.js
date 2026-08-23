import patchright from 'patchright';

export class ScrappingBrowser {
    static #contextPromise = null;

    static async getContext() {
        if (!this.#contextPromise) {
            console.log("Creating ScrappingBrowser...");
            this.#contextPromise = patchright.chromium.launchPersistentContext(
                'C:\\Users\\mehdi\\AppData\\Roaming\\Opera Software\\Opera GX Stable', {
                    executablePath: 'C:\\Users\\mehdi\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
                    headless: false,
                    args: ['--profile-directory=Default'],
                    ignoreDefaultArgs: ['--disable-extensions'],
                    viewport: null
                }
            );
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
}