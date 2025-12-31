<!-- Improved README for pastebin-lite -->
# pastebin-lite

A lightweight Pastebin-like backend API built with Node.js and Express. Stores text pastes in memory and supports time-based (TTL) and view-count-based expiration. Designed for quick local use and easy deployment to serverless platforms such as Vercel.

---

## Quick Overview

- Purpose: Create short-lived text pastes and share them via URL
- Storage: In-memory (ephemeral) — good for demos and serverless environments
- Expiration: `expiresIn` (seconds) and/or `maxViews`
- Optional `TEST_MODE` to shorten expiry values for testing

---

## Project Structure

```
pastebin-lite/
├── index.js
├── package.json
├── Readme.md
├── controllers/
│   └── paste.controller.js
├── routes/
│   └── paste.routes.js
├── services/
│   └── paste.service.js
└── utils/
    └── time.js
```

- `index.js`: App entry point and server bootstrap.
- `controllers/paste.controller.js`: Express route handlers.
- `routes/paste.routes.js`: Route definitions for `/api/pastes` and `/api/health`.
- `services/paste.service.js`: Business logic and in-memory storage for pastes.
- `utils/time.js`: Helpers for expiry calculations and test-mode scaling.

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Install

```bash
git clone <your-repo-url>
cd pastebin-lite
npm install
```

### Environment

Create a `.env` file (optional):

```
TEST_MODE=false
PORT=3000
```

### Run

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

---

## API

Base path: `/api`

### Create a Paste

- Method: `POST`
- Endpoint: `/api/pastes`
- Body (JSON):

```json
{
  "content": "Your text content here",
  "expiresIn": 3600,   // optional — seconds until expiry
  "maxViews": 10       // optional — maximum views
}
```

Example cURL:

```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World","expiresIn":3600,"maxViews":5}'
```

Success response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "/api/pastes/550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2025-12-31T12:00:00.000Z",
  "maxViews": 5
}
```

### Get a Paste

- Method: `GET`
- Endpoint: `/api/pastes/:id`

Example:

```bash
curl http://localhost:3000/api/pastes/550e8400-e29b-41d4-a716-446655440000
```

Success response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Your text content here",
  "createdAt": "2025-12-31T11:00:00.000Z",
  "expiresAt": "2025-12-31T12:00:00.000Z",
  "viewsRemaining": 4
}
```

Error (not found or expired):

```json
{ "error": "Paste not found or expired" }
```

### Health Check

- Method: `GET`
- Endpoint: `/api/health`

Response:

```json
{ "status": "ok", "timestamp": "2025-12-31T11:00:00.000Z" }
```

---

## Expiration Rules

- `expiresIn` — time-to-live in seconds. When set, the paste expires after that many seconds.
- `maxViews` — a paste with `maxViews` decrements its remaining views on each GET; when it reaches zero the paste is removed.
- If both are provided the paste expires when either condition is met.
- `TEST_MODE=true` scales time-based expirations down (for example, to 10% of the provided duration) with a minimum of 10 seconds to make testing quicker.

---

## Storage & Persistence

- Current implementation: in-memory JavaScript object (ephemeral). Data is lost on server restart.
- For production, swap the service layer (`services/paste.service.js`) to use a persistent store such as Redis, MongoDB, or PostgreSQL.

---

## Deployment

This project can be deployed to Vercel as a serverless function or to any Node-capable host.

Quick Vercel deploy:

```bash
npm install -g vercel
vercel
# or for production
vercel --prod
```

Add `TEST_MODE` and other environment variables via the Vercel dashboard if needed.

---

## Security & Recommendations

- No authentication or authorization is included by default — pastes are public if you share the URL.
- Add input validation and sanitization before rendering content in a browser.
- Add rate limiting to protect the API from abuse.
- Consider optional password-protected pastes or signed URLs for private content.

---

## Development Notes

- See `controllers/paste.controller.js` for request handling and `services/paste.service.js` for paste lifecycle logic.
- `utils/time.js` contains helpers used for expiry and `TEST_MODE` scaling.
- To add persistence, implement a new storage backend and replace the in-memory store in `paste.service.js`.

---

## Examples (Node client)

```js
// simple example using node-fetch
const fetch = require('node-fetch');

async function createPaste(text) {
  const res = await fetch('http://localhost:3000/api/pastes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: text, expiresIn: 60, maxViews: 2 })
  });
  return res.json();
}

async function getPaste(id) {
  const res = await fetch(`http://localhost:3000/api/pastes/${id}`);
  return res.json();
}
```

---

## License

MIT

---

## Contact

Maintainer: (add your name)