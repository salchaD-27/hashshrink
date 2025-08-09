import crypto from 'crypto';

const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Convert a buffer into a Base62 string
function toBase62(buffer) {
  let num = BigInt('0x' + buffer.toString('hex')); 
  let output = '';
  while (num > 0n) {
    const remainder = num % 62n;
    output = BASE62_CHARS[Number(remainder)] + output;
    num = num / 62n;
  }
  return output;
}

// SHA256 ensures the mapping is deterministic and hard to guess.
// Base62 encoding makes the code short and URL-safe.
// We take only 6 bytes from the hash so that:
// We keep the short code compact (~8 characters).
// Collisions remain rare for small/medium-scale usage.
// You can increase length if you want fewer collisions and more uniqueness.

/**
 * Generate a short code from a URL using SHA256 + Base62 encoding.
 * @param {string} originalURL
 * @param {number} length - Length of short code (default 8)
 */
export function hashShortCode(originalURL, length = 8) {
  // Step 1: Create SHA256 hash of the URL
  const hash = crypto.createHash('sha256').update(originalURL).digest();
  // Step 2: Take first N bytes (here, 6 bytes before Base62)
  const shortBuffer = hash.subarray(0, 6); // 48 bits → enough to avoid collisions for small datasets
  // Step 3: Convert to Base62
  const base62Code = toBase62(shortBuffer);
  // Step 4: Return trimmed to desired length
  return base62Code.substring(0, length);
}

// const shortCode = hashShortCode('https://example.com/some/long/path');
// console.log(shortCode); // e.g. "aZ3k9fB2"