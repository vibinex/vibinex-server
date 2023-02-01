import { Pool } from 'pg';

const conn = new Pool({
	user: process.env.PGSQL_USER,
	password: process.env.PGSQL_PASSWORD,
	host: process.env.PGSQL_HOST,
	port: parseInt(process.env.PGSQL_PORT ?? "0"),
	database: process.env.PGSQL_DATABASE,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
})

export default conn;