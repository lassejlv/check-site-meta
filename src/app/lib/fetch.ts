import fetch2 from "node-fetch";
import { getUserSettings } from "./get-settings";

const fetchInstance = globalThis.fetch;


export async function appFetch(...args: Parameters<typeof fetchInstance>) {
  const settings = await getUserSettings()

  const res = await fetchInstance(args[0], {
    // referrer: "http://localhost:3000",
    ...args[1],
    headers: {
      'User-Agent': settings.userAgent,
      'Accept-Language': 'en-GB-oxendict,en-GB;q=0.9,en;q=0.8,id;q=0.7,en-US;q=0.6',
      'Cache-Control': 'no-store', // Prevents caching
      'Pragma': 'no-cache', // For compatibility with HTTP/1.0 caches
      'Expires': '0', // Forces the response to always be fresh
      // 'referer': 'http://localhost:3000',
      ...args[1]?.headers
    },
    redirect: "follow",
    cache: "no-store"
  })
  return res
}

export function withProxy(url: string) {
  return `/proxy-img?url=${ encodeURIComponent(url) }`
}


export const defaultUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0 bot alfonbot curl/8.0.1 facebookexternalhit'
export const defualtAcceptLanguage = 'en-GB-oxendict,en-GB;q=0.9,en;q=0.8,id;q=0.7,en-US;q=0.6'