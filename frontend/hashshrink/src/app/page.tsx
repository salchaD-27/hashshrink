'use client';
import Image from "next/image";
import { Bodoni_Moda, Bodoni_Moda_SC, Girassol } from 'next/font/google'
import { useState } from "react";
const bodo = Bodoni_Moda({weight: ['400','500','600','700','800','900'], style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-p', adjustFontFallback: true })
const bodosc = Bodoni_Moda_SC({weight: ['400','500','600','700','800','900'], style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-p', adjustFontFallback: true })
const gira = Girassol({weight: ['400'], style: ['normal'], subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-p', adjustFontFallback: true })


interface ShortenResponse {
  shortCode: string;
  ipfsHash: string;
}
interface ResolveResponse {
  originalURL: string;
}
interface StatsResponse {
  hits: number;
}

export default function Home() {
  const [originalURL, setOriginalURL] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [shortenResult, setShortenResult] = useState<ShortenResponse|null>(null);
  const [resolveResult, setResolveResult] = useState<ResolveResponse|null>(null);
  const [statsResult, setStatsResult] = useState<StatsResponse|null>(null);
  const [prefix, setPrefix] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // POST /shorten
  async function handleShorten(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShortenResult(null);
    const res = await fetch("http://localhost:3001/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalURL })
    });
    const data = await res.json();
    setShortenResult(data);
    setShortCode(data.shortCode);
  }

  // GET /resolve/:shortCode
  async function handleResolve(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/api/resolve/${shortCode}`);
    const data = await res.json();
    setResolveResult(data);
  }

  // GET /stats/:shortCode
  async function handleStats(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/api/stats/${shortCode}`);
    const data = await res.json();
    setStatsResult(data);
  }

  // GET /search?prefix=
  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/api/search?prefix=${prefix}`);
    const data = await res.json();
    setSearchResults(data.results || []);
  }

  return (
    <>
    <div className={`min-h-[80vh] w-screen bg-black text-white flex flex-col items-center justify-center gap-2 text-center text-xl ${bodo.className}`}>
      <div className={`${gira.className} text-3xl mb-10 flex items-center justify-center`}>
        <Image src="/hashshrinklogowhite.png" alt="polychatlogowhite" height={100} width={100} className="object-contain object-left"/>
        URL Shortener</div>

      {/* Shorten Form */}
      <form onSubmit={handleShorten}>
        <input
          className="h-[38] w-auto px-4 border-1 border-white rounded"
          value={originalURL}
          onChange={(e) => setOriginalURL(e.target.value)}
          placeholder="Paste your long URL"
          style={{ width: "400px", padding: "8px" }}
        />
        <button className='h-[38] w-auto px-4 bg-white text-black rounded cursor-pointer ml-4' type="submit">Shorten URL</button>
      </form>

      {shortenResult && (
        <div style={{ marginTop: "10px" }}>
          <div><b>Short Code:</b> {shortenResult.shortCode}</div>
          <div>
            <b>IPFS:</b>{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://ipfs.io/ipfs/${shortenResult.ipfsHash}`}
            >
              {shortenResult.ipfsHash}
            </a>
          </div>
          <div>
            <b>Short URL:</b>{" "}
            <a
              href={`/${shortenResult.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {window.location.origin}/{shortenResult.shortCode}
            </a>
          </div>
        </div>
      )}

      <hr />

      {/* Resolve */}
      <form onSubmit={handleResolve}>
        <input
          className="h-[38] w-auto px-4 border-1 border-white rounded"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="Enter short code to resolve"
        />
        <button className='h-[38] w-auto px-4 bg-white text-black rounded cursor-pointer ml-4' type="submit">Resolve</button>
      </form>
      {resolveResult && (
        <div>
          <b>Resolved URL:</b> {resolveResult.originalURL || "Not Found"}
        </div>
      )}

      <hr />

      {/* Stats */}
      <form onSubmit={handleStats}>
        <input
          className="h-[38] w-auto px-4 border-1 border-white rounded"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="Short code for stats"
        />
        <button className='h-[38] w-auto px-4 bg-white text-black rounded cursor-pointer ml-4' type="submit">Get Stats</button>
      </form>
      {statsResult && (
        <div>
          <b>Hits:</b> {statsResult.hits}
        </div>
      )}

      <hr />

      {/* Search */}
      <form onSubmit={handleSearch}>
        <input
          className="h-[38] w-auto px-4 border-1 border-white rounded"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          placeholder="Enter prefix to search"
        />
        <button className='h-[38] w-auto px-4 bg-white text-black rounded cursor-pointer ml-4' type="submit">Search</button>
      </form>
      {searchResults.length > 0 && (
        <div>
          <b>Search Results:</b>
          <ul>
            {searchResults.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <div className={`h-[20vh] w-full bg-white text-black flex items-center justify-center ${bodo.className}`}>
      <div className={`h-full w-1/4 flex items-center justify-center text-2xl ${gira.className}`}>
      <Image src="/hashshrinklogoblack.png" alt="polychatlogowhite" height={100} width={100} className="object-contain object-left"/>
      URL Shortener</div>
      <div className="h-full w-3/4 flex items-center justify-center text-sm p-4 text-center">HashShrink, is a blockchain-integrated URL shortener service designed to provide efficient, censorship-resistant, and immutable URL shortening. It works by mapping long URLs to compact short codes using advanced data structures like hash maps for rapid lookup and tries for prefix-based search and autocomplete. To prevent abuse, it incorporates rate limiting and analytics features to monitor usage and unique visitors efficiently. The uniqueness and immutability of your shortened URLs are enforced through collision-safe hashing combined with decentralized storage. URL metadata is stored off-chain on IPFS, ensuring censorship resistance and tamper-proof records, with references to these stored on the blockchain (optional integration). The backend uses Node.js with Redis to efficiently manage storage and rate limits, while a React/Next.js frontend lets users shorten URLs, resolve short codes, check analytics, and search short codes by prefix interactively.</div>
    </div>
    </>
  );
}
