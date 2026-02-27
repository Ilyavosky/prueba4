import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url("La DATABASE_URL debe ser una URL válida"),
  JWT_SECRET: z.string().min(1, "El JWT_SECRET es requerido"),
  FRONTEND_URL: z.string().min(1, "El FRONTEND_URL es requerido para el CORS"),
  DB_POOL_MAX: z.string().optional().default("10").transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment variables");
  }
  
  return result.data;
};

export const env = parseEnv();
