import express from 'express';
import { setMapping, getByShortCode, getByOriginalURL } from '../data/hashMap.js';
import trie from '../data/trie.js';
import { isAllowed } from '../data/rateLimiter.js';
import { incrementHit, getHits } from '../data/analytics.js';
import { storeMappingOnIPFS } from '../config/ipfs.js';
import { getUniqueShortCode } from '../services/urlShortener.js';

const router = express.Router();

// Rate limiting middleware for /shorten
router.post('/shorten', async (req, res, next) => {
  const ip = req.ip;
  const allowed = await isAllowed(ip);
  if (!allowed) return res.status(429).json({ error: 'Rate limit exceeded' });
  next();
}, async (req, res) => {
  const { originalURL } = req.body;
  // Hashing and encoding (implement hashShortCode elsewhere)
  //  const shortCode = hashShortCode(originalURL);  // base62 + SHA256
  //   await setMapping(shortCode, originalURL);
  const shortCode = await getUniqueShortCode(originalURL);
  await setMapping(shortCode, originalURL); // Now safe to store the mapping
  trie.insert(shortCode);

  // IPFS storage
  const metadata = { shortCode, originalURL, creator: req.user || 'anon', timestamp: Date.now() };
  const ipfsHash = await storeMappingOnIPFS(metadata);

  res.json({ shortCode, ipfsHash });
});

router.get('/resolve/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const originalURL = await getByShortCode(shortCode);
  if (!originalURL) return res.status(404).json({ error: 'Not found' });
  await incrementHit(shortCode);
  res.json({ originalURL });
});

router.get('/stats/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const hits = await getHits(shortCode);
  res.json({ hits });
});

router.get('/search', (req, res) => {
  const { prefix } = req.query;
  const results = trie.searchPrefix(prefix);
  res.json({ results });
});

export default router;
