import { env } from 'process';

const baseUrl =
  env.NODE_ENV === 'production' ? 'worst-champ.vercel.app' : 'localhost:8000';
export const socketUrl = `PROTOCOL://${baseUrl}/socket`.replace(
  'PROTOCOL',
  env.NODE_ENV === 'production' ? 'wss' : 'ws'
);
export const apiUrl = `PROTOCOL://${baseUrl}/api`.replace(
  'PROTOCOL',
  env.NODE_ENV === 'production' ? 'https' : 'http'
);
