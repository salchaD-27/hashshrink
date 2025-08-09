// Collision-Detection Helper
import { hashShortCode } from '../utils/hash.js';
import { setMapping, getByShortCode, getByOriginalURL } from '../data/hashMap.js';

/**
 * Generate a unique short code for a URL, checking for collisions.
 * @param {string} originalURL
 * @param {number} maxTries
 * @param {number} length
 */
export async function getUniqueShortCode(originalURL, maxTries = 5, length = 8) {
  for (let i = 0; i < maxTries; i++) {
    // Use an offset for additional entropy in rare collision cases
    const shortCode = hashShortCode(originalURL + (i ? `#${i}` : ''), length);
    const existingUrl = await getByShortCode(shortCode);
    if (!existingUrl) return shortCode;
    if (existingUrl === originalURL) return shortCode; // same mapping exists
    // Otherwise, collision: try again with a different hash
  }
  throw new Error('Short code collision - max tries exceeded!');
}
