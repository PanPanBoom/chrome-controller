import { Source } from "./Source.js";
import crypto from 'crypto';

function hasLeadingZeroBits(hash, bits) {
  const fullBytes = Math.floor(bits / 8);
  const remainingBits = bits % 8;

  for (let i = 0; i < fullBytes; i++) {
    if (hash[i] !== 0) return false;
  }

  if (remainingBits > 0) {
    const mask = 0xff << (8 - remainingBits);
    if ((hash[fullBytes] & mask) !== 0) return false;
  }

  return true;
}

// Notre solveur simplifié avec le module natif de Node.js
function solvePoW(challenge, difficulty) {
  let nonce = 0;
  const startTime = Date.now();

  console.log(`Recherche du nonce (difficulté: ${difficulty})...`);

  while (nonce <= 50000000) { // Sécurité comme dans leur script
    // On crée le hash SHA-256 natif
    // .digest() renvoie un Buffer (qui se comporte comme un Uint8Array)
    const hash = crypto.createHash('sha256').update(challenge + nonce).digest();

    if (hasLeadingZeroBits(hash, difficulty)) {
      const elapsed = Date.now() - startTime;
      console.log(`Nonce trouvé en ${elapsed}ms : ${nonce}`);
      return nonce.toString();
    }

    nonce++;
  }

  throw new Error("Nonce introuvable après 50M d'itérations");
}

export class MappleTVSource extends Source
{
    constructor()
    {
        super("Mapple", "https://mapple.fun", "/watch");
        this.apiUrl = this.baseUrl + '/api/'
        this.baseHeaders = {};
        this.lastIdFetched = null;
        this.lastEpisodeFetched = null;
        this.lastIntentFetched = null;
    }

    fetchUrl(id, episodeInfo = null)
    {
        return `${this.watchUrl}/${id}${id.includes('tv') ? `-${episodeInfo?.season ?? 1}-${episodeInfo?.episode ?? 1}` : ''}`;
    }

    async getVideoToken(mediaId, episodeInfo, mediaType, requestToken, challengeId, challenge, difficulty)
    {
        const nonce = solvePoW(challenge, difficulty);
        const challengeRes = await fetch(`${this.apiUrl}/playback-init`, {
            headers: this.baseHeaders,
            body: JSON.stringify({
                mediaId,
                mediaType,
                requestToken,
                "tv_slug": mediaType === "tv" ? `${episodeInfo?.season ?? 1}-${episodeInfo?.episode ?? 1}` : undefined,
                pow: {
                    challengeId,
                    nonce
                }
            }),
            method: "POST"
        });
        
        if(challengeRes.status !== 200)
        {
            this.log(`Error ${challengeRes.status} while resolving challenge: ${challengeRes.statusText}`);
            return "";
        }

        const challengeResolved = await challengeRes.json();

        return challengeResolved.token;
    }

    async getVideoUrlFromSource(mediaId, episodeInfo, mediaType, requestToken, videoToken, source)
    {
        this.log('Fetching for source ' + source);
    
        const encryptRes = await fetch(`${this.apiUrl}/encrypt`, {
            headers: this.baseHeaders,
            "body": JSON.stringify({
                data: {
                    mediaId,
                    mediaType,
                    "tv_slug": mediaType === "tv" ? `${episodeInfo?.season ?? 1}-${episodeInfo?.episode ?? 1}` : "",
                    source
                },
                endpoint: 'stream-encrypted',
                requestToken
            }),
            "method": "POST"
        });

        if(encryptRes.status !== 200)
        {
            this.log(`Source ${source} not available, error ${encryptRes.status} while encrypting: ${encryptRes.statusText}`);
            return "";
        }

        const encrypt = await encryptRes.json();

        const urlRes = await fetch(`${this.baseUrl}${encrypt.url}&requestToken=${requestToken}&token=${videoToken}`, {
            headers: this.baseHeaders,
            "method": "GET"
        });

        if(urlRes.status !== 200)
        {
            this.log(`Source ${source} not available, error ${urlRes.status} while getting url: ${urlRes.statusText}`);
            return "";
        }

        const url = await urlRes.json();

        if(!url.success)
        {
            this.log(`Source ${source} does not have content`);
            return "";
        }

        return url.data.stream_url
    }

    async getCookies()
    {
        const manifestRes = await fetch(`${this.baseUrl}`, {
            method: 'GET',
            headers: {
                'User-Agent': this.userAgent
            }
        });

        if(manifestRes.status !== 200)
        {
            this.log(`Error ${manifestRes.status} while fetching cookies: ${manifestRes.statusText}`);
            return;
        }

        this.log('Cookies: ', manifestRes.headers.getSetCookie());

        this.baseHeaders = {
            "accept": "*/*",
            "content-type": "application/json",
            "Referer": this.baseUrl + '/',
            "Origin": this.baseUrl,
            "cookie": manifestRes.headers.getSetCookie().map(cookie => cookie.split(';')[0]).join(';'),
            "User-Agent": this.userAgent
        };

    }

    async fetchVideoInfo(id, episodeInfo = null)
    {
        if(id === this.lastIdFetched && episodeInfo === this.lastEpisodeFetched)
            return { url: this.lastIntentFetched };

        await this.getCookies();

        const sessionRes = await fetch(`${this.apiUrl}/ui/session`, {
            method: 'POST',
            headers: this.baseHeaders
        });

        if(sessionRes.status !== 200)
        {
            this.log(`Error ${sessionRes.status} while fetching session: ${sessionRes.statusText}`);
            return { url: '' };
        }

        const session = await sessionRes.json();

        const [ mediaType, realId ] = id.split('/');

        const token = session.token;
        this.log("Token reçu:", token);

        const initRes = await fetch(`${this.apiUrl}/media-session`, {
            headers: this.baseHeaders,
            "body": JSON.stringify({
                "mediaId": realId,
                "mediaType": mediaType,
                "requestToken": token,
                "tv_slug": mediaType === "tv" ? `${episodeInfo?.season ?? 1}-${episodeInfo?.episode ?? 1}` : undefined
            }),
            "method": "POST"
        });

        if(initRes.status !== 200)
        {
            this.log(`Error ${initRes.status} while fetching video source: ${initRes.statusText}`);
            this.log(await initRes.text());
            return { url: "" };
        }

        const init = await initRes.json();

        const videoToken = await this.getVideoToken(realId, episodeInfo, mediaType, token, init.pow.challengeId, init.pow.challenge, init.pow.difficulty)

        for(const source of ['mapple', 's25', 's2', 's19', 's13'])
        {
            const videoUrl = await this.getVideoUrlFromSource(realId, episodeInfo, mediaType, token, videoToken, source);

            if(videoUrl === "")
                continue;

            return {
                url: videoUrl,
                referer: this.baseUrl + "/"    
            };
        }

        return { url: "" };
    }

    async fetchAvailability(id, episodeInfo = null)
    {
        const videoInfo = await this.getShowVideoInfo(id, episodeInfo);

        return videoInfo.url !== "" ?
            [{
                name: this.name,
                language: 'VOSTFR'
            }] : 
            null;
    }
}