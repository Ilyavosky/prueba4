import { Pool } from 'pg';
import { env } from '../env.server';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 3000,
});

pool.on('error', (err) => {
  console.error('Error inesperado de PostgreSQL en un cliente inactivo', err);

});

// Exportamos un wrapper limpio para hacer queries en nuestros repositorios
export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  // getClient() obtiene una conexión dedicada del pool para transacciones (BEGIN/COMMIT/ROLLBACK)
  getClient: () => pool.connect(),
};