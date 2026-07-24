import conn from '.';
import PubSubMessage from '../../types/PubSubMessage';

export type DpuJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DpuJob {
	id: string;
	installation_id: string;
	msg_type: string;
	payload: PubSubMessage;
	status: DpuJobStatus;
	attempts: number;
	locked_until: Date | null;
	created_at: Date;
	updated_at: Date;
}

export const DPU_JOBS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS dpu_jobs (
	id BIGSERIAL PRIMARY KEY,
	installation_id TEXT NOT NULL,
	msg_type TEXT NOT NULL,
	payload JSONB NOT NULL,
	status TEXT NOT NULL DEFAULT 'pending',
	attempts INTEGER NOT NULL DEFAULT 0,
	locked_until TIMESTAMPTZ,
	claimed_at TIMESTAMPTZ,
	completed_at TIMESTAMPTZ,
	failed_at TIMESTAMPTZ,
	last_error TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dpu_jobs_claim_idx
	ON dpu_jobs (installation_id, status, created_at)
	WHERE status IN ('pending', 'processing');
`;

let schemaReady: Promise<void> | null = null;

export async function ensureDpuJobsTable(): Promise<void> {
	if (!schemaReady) {
		schemaReady = conn.query(DPU_JOBS_SCHEMA_SQL).then(
			() => undefined,
			(err) => {
				schemaReady = null;
				throw err;
			}
		);
	}
	return schemaReady;
}

export async function enqueueDpuJob(
	installationId: string,
	msgType: string,
	payload: PubSubMessage,
): Promise<string> {
	await ensureDpuJobsTable();
	const query = `
		INSERT INTO dpu_jobs (installation_id, msg_type, payload)
		VALUES ($1, $2, $3)
		RETURNING id
	`;
	const result = await conn.query(query, [installationId, msgType, payload]).catch((err) => {
		console.error('[enqueueDpuJob] Failed to insert DPU job', { pg_query: query, installationId, msgType }, err);
		throw err;
	});
	return result.rows[0].id.toString();
}

export async function claimDpuJobs(
	installationId: string,
	limit = 1,
	leaseSeconds = 300,
): Promise<DpuJob[]> {
	await ensureDpuJobsTable();
	const query = `
		WITH claimable AS (
			SELECT id
			FROM dpu_jobs
			WHERE installation_id = $1
				AND (
					status = 'pending'
					OR (status = 'processing' AND locked_until < NOW())
				)
			ORDER BY created_at ASC
			LIMIT $2
			FOR UPDATE SKIP LOCKED
		)
		UPDATE dpu_jobs
		SET
			status = 'processing',
			attempts = attempts + 1,
			claimed_at = NOW(),
			locked_until = NOW() + ($3::TEXT || ' seconds')::INTERVAL,
			updated_at = NOW()
		WHERE id IN (SELECT id FROM claimable)
		RETURNING *
	`;
	const result = await conn.query(query, [installationId, limit, leaseSeconds]).catch((err) => {
		console.error('[claimDpuJobs] Failed to claim DPU jobs', { pg_query: query, installationId, limit, leaseSeconds }, err);
		throw err;
	});
	return result.rows.map(row => ({ ...row, id: row.id.toString() }));
}

export async function ackDpuJob(jobId: string, installationId: string): Promise<boolean> {
	await ensureDpuJobsTable();
	const query = `
		UPDATE dpu_jobs
		SET status = 'completed',
			completed_at = NOW(),
			locked_until = NULL,
			updated_at = NOW()
		WHERE id = $1 AND installation_id = $2 AND status = 'processing'
	`;
	const result = await conn.query(query, [jobId, installationId]).catch((err) => {
		console.error('[ackDpuJob] Failed to acknowledge DPU job', { pg_query: query, jobId, installationId }, err);
		throw err;
	});
	return result.rowCount === 1;
}

export async function failDpuJob(
	jobId: string,
	installationId: string,
	error: string,
	retry = true,
): Promise<boolean> {
	await ensureDpuJobsTable();
	const query = `
		UPDATE dpu_jobs
		SET status = CASE WHEN $3 THEN 'pending' ELSE 'failed' END,
			failed_at = CASE WHEN $3 THEN failed_at ELSE NOW() END,
			locked_until = NULL,
			last_error = $4,
			updated_at = NOW()
		WHERE id = $1 AND installation_id = $2 AND status = 'processing'
	`;
	const result = await conn.query(query, [jobId, installationId, retry, error]).catch((err) => {
		console.error('[failDpuJob] Failed to mark DPU job failed', { pg_query: query, jobId, installationId, retry }, err);
		throw err;
	});
	return result.rowCount === 1;
}
