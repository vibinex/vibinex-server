import { Pool } from 'pg';

const conn = new Pool({
	user: process.env.PGSQL_USER,
	password: process.env.PGSQL_PASSWORD,
	host: process.env.PGSQL_HOST,
	port: parseInt(process.env.PGSQL_PORT ?? "0"),
	database: process.env.PGSQL_DATABASE,
	ssl: process.env.PGSQL_HOST?.includes('supabase') ? { rejectUnauthorized: false } : undefined,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 10000,
})

export default conn;