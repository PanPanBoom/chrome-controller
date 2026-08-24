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
        super("https://mapple.tv", "/watch");
        this.baseHeaders = {};
    }

    getShowUrl(id, episodeInfo = null)
    {
        return `${this.watchUrl}/${id}${id.includes('tv') ? `-${episodeInfo?.season ?? 1}-${episodeInfo?.episode ?? 1}` : ''}`;
    }

    async getVideoToken(mediaId, mediaType, requestToken, challengeId, challenge, difficulty)
    {
        const nonce = solvePoW(challenge, difficulty);
        const challengeRes = await fetch("https://mapple.tv/api/playback-init", {
            headers: this.baseHeaders,
            "body": JSON.stringify({
                mediaId,
                mediaType,
                requestToken,
                pow: {
                    challengeId,
                    nonce
                }
            }),
            "method": "POST"
        });
        
        if(challengeRes.status !== 200)
        {
            console.log(`Error ${challengeRes.status} while resolving challenge: ${challengeRes.statusText}`);
            return "";
        }

        const challengeResolved = await challengeRes.json();

        return challengeResolved.token;
    }

    async getVideoUrlFromSource(mediaId, episodeInfo, mediaType, requestToken, videoToken, source)
    {
        console.log('Fetching for source ' + source);
    
        const encryptRes = await fetch("https://mapple.tv/api/encrypt", {
            headers: this.baseHeaders,
            "body": JSON.stringify({
                data: {
                    mediaId,
                    mediaType,
                    "tv_slug": `${mediaType === "tv" ? `${episodeInfo?.season ?? 1}-${episodeInfo?.episode ?? 1}` : ""}`,
                    source
                },
                endpoint: 'stream-encrypted',
                requestToken
            }),
            "method": "POST"
        });

        const encrypt = await encryptRes.json();

        const urlRes = await fetch(`${this.baseUrl}${encrypt.url}&requestToken=${requestToken}&token=${videoToken}`, {
            headers: this.baseHeaders,
            "method": "GET"
        });

        if(urlRes.status !== 200)
        {
            console.log(`Source ${source} not available`);
            return "";
        }

        const url = await urlRes.json();

        if(!url.success)
        {
            console.log(`Source ${source} does bot have content`);
            return "";
        }

        return url.data.stream_url
    }

    async getShowVideoInfo(id, episodeInfo = null)
    {
        const resToken = await fetch(this.getShowUrl(id, episodeInfo));
        const html = await resToken.text();

        const rawCookies = resToken.headers.get('set-cookie');
        const dynamicCookie = rawCookies ? rawCookies.split(';')[0] : '';

        const match = html.match(/window\.__REQUEST_TOKEN__\s*=\s*"([^"]+)"/);

        const [ mediaType, realId ] = id.split('/');

        if (match)
        {
            const token = match[1];
            console.log("Token extrait :", token);

            this.baseHeaders = {
                "accept": "*/*",
                "content-type": "application/json",
                "Referer": this.baseUrl,
                "cookie": dynamicCookie
            };

            const initRes = await fetch("https://mapple.tv/api/playback-init", {
                headers: this.baseHeaders,
                "body": JSON.stringify({
                    "mediaId": realId,
                    "mediaType": mediaType,
                    "requestToken": token
                }),
                "method": "POST"
            });

            if(initRes.status !== 200)
            {
                console.log(`Error ${initRes.status} while fetching video source: ${initRes.statusText}`);
                return { url: "" };
            }

            const init = await initRes.json();

            const videoToken = await this.getVideoToken(realId, mediaType, token, init.pow.challengeId, init.pow.challenge, init.pow.difficulty)

            for(const source of ['mapple', 's25', 's2'])
            {
                const videoUrl = await this.getVideoUrlFromSource(realId, episodeInfo, mediaType, token, videoToken, source);

                if(videoUrl === "")
                    continue;

                return {
                    url: videoUrl,
                    referer: this.baseUrl + "/"    
                };
            }
        }

        return { url: "" };
    }

    async checkShowAvailability(id, episodeInfo = null)
    {
        return true;
    }
}