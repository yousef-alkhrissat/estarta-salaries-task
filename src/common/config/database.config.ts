import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: (process.env.DB_TYPE as any) ?? 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME ?? 'estarta_db',
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
  logging: process.env.DB_LOGGING === 'true' || false,
}));
