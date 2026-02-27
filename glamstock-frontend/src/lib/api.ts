import { env } from './env.client';

/**
 * Base URL for the GlamStock Backend API.
 * In the browser, reads from NEXT_PUBLIC_API_URL.
 */
export const API_URL = env.NEXT_PUBLIC_API_URL;
