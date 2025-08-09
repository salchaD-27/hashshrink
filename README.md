# HashShrink

A blockchain-integrated, censorship-resistant URL shortener service designed for secure, immutable, and efficient URL shortening with decentralized metadata storage.

---


## Overview

HashShrink is a state-of-the-art URL shortener that combines traditional backend data structures with blockchain and decentralized storage for censorship resistance and immutability. It ensures fast URL encoding, safe uniqueness, analytics, and robust rate limiting while storing URL metadata on IPFS for distributed permanence.

---

## Features

- Collision-safe SHA256 + Base62 URL hashing for compact, unique short codes
- Fast URL mapping using Redis and in-memory hash maps
- Prefix-based short code search and autocomplete with Trie data structure
- Rate limiting via token bucket/sliding window algorithms to curb abuse
- Analytics tracking: total hits and approximate unique visitors using Bloom filters
- On-chain metadata storage integration via IPFS for decentralized tamper-proof records
- RESTful API covering shortening, resolving, analytics, and searching
- User-friendly React/Next.js frontend with seamless integration and real-time feedback

---

## Architecture & Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Data Storage:** Redis (fast cache for mappings and counters)
- **Decentralized Storage:** IPFS via `ipfs-http-client`
- **Data Structures:** Hash maps, Trie, Bloom filter
- **Frontend:** React + Next.js + TypeScript
- **Testing:** Jest, Supertest

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Redis Server running locally or remotely
- IPFS daemon running locally or accessible via API
- npm or yarn package manager

### Installation

1. Clone the repo:
```
git clone https://github.com/yourusername/hashshrink.git
cd hashshrink/backend
```

2. Install backend dependencies:
```
npm install
```

3. Set up `.env` with Redis and IPFS config (example):
```
REDIS_URL=redis://127.0.0.1:6379
IPFS_API=http://localhost:5001
```

4. Start Redis:
```
redis-server
```

5. Start IPFS daemon in another terminal:
```
ipfs daemon
```

6. Run backend server:
```
npm run dev
```

7. Setup and run the frontend:
```
cd ../frontend
npm install
npm run dev
```


---

## API Endpoints

| Endpoint               | Method | Description                             | Request Body / Params                | Response                 |
|------------------------|--------|-------------------------------------|------------------------------------|--------------------------|
| `/api/shorten`          | POST   | Shorten a long URL                   | `{ originalURL: string }`           | `{ shortCode, ipfsHash }`|
| `/api/resolve/:shortCode` | GET    | Retrieve original URL by short code | `shortCode` as URL param            | `{ originalURL }`         |
| `/api/stats/:shortCode` | GET    | Get hit count stats for short code  | `shortCode` as URL param            | `{ hits }`                |
| `/api/search?prefix=`   | GET    | Search short codes by prefix        | `prefix` query param                | `{ results: string[] }`   |

---

## Usage

- Use the backend API to shorten URLs, retrieve original links, check analytics, and search short codes.
- The React/Next.js frontend provides a dashboard for seamless interaction with the API.
- IPFS hashes store metadata off-chain ensuring censorship resistance and immutability.
- Rate limiting protects the service from abusive usage.

---

## Testing

- Automated API tests are included using Jest and Supertest.
- Test cases cover idempotent shortening, collision handling, correct resolution, stats increments, and rate limiting.
- Run tests by executing:

