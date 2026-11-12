import { createServer } from 'vite';

// Keep the server in this process so Windows teardown needs no process-tree kill.
export default async function setup() {
  try {
    const response = await fetch('http://127.0.0.1:5173/', { signal: AbortSignal.timeout(1000) });
    if (response.ok) return;
  } catch { /* No existing preview: start a local Vite instance. */ }
  const server = await createServer({ server: { host: '127.0.0.1', port: 5173, strictPort: true } });
  await server.listen();
  return async () => { await server.close(); };
}
