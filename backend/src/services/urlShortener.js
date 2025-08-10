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
    // On the first iteration (i=0):
    // Hash is generated from just originalURL.
    // On later iterations (i=1, i=2, …):
    // Adds #<i> at the end of the URL string before hashing.
    // This changes the hash completely, giving “extra entropy” so that repeated tries don’t keep producing the same code.

    // Use an offset for additional entropy in rare collision cases
    const shortCode = hashShortCode(originalURL + (i ? `#${i}` : ''), length);
    const existingUrl = await getByShortCode(shortCode); // checked against the store using getByShortCode to see if it is already taken.
    if (!existingUrl) return shortCode;
    if (existingUrl === originalURL) return shortCode; // If the code is in use but maps to the exact same URL -> accept it too (we’ve shortened this URL before, so we reuse the same code — keeps mapping idempotent).
    // If the code exists but maps to a different URL -> collision -> try again with i+1.
  }
  throw new Error('Short code collision - max tries exceeded!');
}

// eg, originalURL = "https://example.com"
// hashShortCode returns "AbCdEf12" for that URL.
// Data store currently contains:
// "AbCdEf12" -> "https://openai.com"

// Try 1 (i=0):
// Generate "AbCdEf12".
// Found mapping "AbCdEf12" -> "https://openai.com" -> collision.

// Try 2 (i=1):
// Hash "https://example.com#1" -> "GhIjKl34".
// No mapping found -> return "GhIjKl34".