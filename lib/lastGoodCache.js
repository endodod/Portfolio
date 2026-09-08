// In-memory fallback store: keeps the last successfully fetched payload per
// route so a rate-limited or failing upstream API can still serve something
// instead of "(unavailable)". Persists only for the lifetime of the running
// server process — on Vercel that means it survives while a serverless
// function instance stays warm, but resets on a cold start.
const store = new Map();

export function getLastGood(key) {
  return store.get(key) || null;
}

export function setLastGood(key, data) {
  store.set(key, data);
}
