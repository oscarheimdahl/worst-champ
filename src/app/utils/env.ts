import { env } from 'process';

const prod = env.NODE_ENV === 'production';

const baseUrl = prod ? 'worst-champ-server.deno.dev' : 'localhost:8000';
export const socketUrl = `PROTOCOL://${baseUrl}/socket`.replace(
  'PROTOCOL',
  prod ? 'wss' : 'ws'
);
export const apiUrl = `PROTOCOL://${baseUrl}/api`.replace(
  'PROTOCOL',
  prod ? 'https' : 'http'
);
