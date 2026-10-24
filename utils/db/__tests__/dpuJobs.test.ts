import conn from '..';
import { ackDpuJob, claimDpuJobs, enqueueDpuJob, ensureDpuJobsTable, failDpuJob } from '../dpuJobs';

const INSTALLATION_ID = `jest-dpu-${Date.now()}`;

describe('dpuJobs queue helpers', () => {
	beforeAll(async () => {
		await ensureDpuJobsTable();
	});

	afterEach(async () => {
		await conn.query('DELETE FROM dpu_jobs WHERE installation_id = $1', [INSTALLATION_ID]);
	});

	afterAll(async () => {
		await conn.end();
	});

	it('enqueues and claims jobs in FIFO order', async () => {
		const firstJobId = await enqueueDpuJob(INSTALLATION_ID, 'manual_trigger', { pr_number: '1' });
		const secondJobId = await enqueueDpuJob(INSTALLATION_ID, 'webhook_callback', { pr_number: '2' });

		const jobs = await claimDpuJobs(INSTALLATION_ID, 2, 30);

		expect(jobs.map(job => job.id.toString())).toEqual([firstJobId, secondJobId]);
		expect(jobs.map(job => job.msg_type)).toEqual(['manual_trigger', 'webhook_callback']);
		expect(jobs[0].status).toBe('processing');
		expect(jobs[0].attempts).toBe(1);
	});

	it('acknowledges only processing jobs for the installation', async () => {
		const jobId = await enqueueDpuJob(INSTALLATION_ID, 'PATSetup', { provider: 'github' });
		expect(await ackDpuJob(jobId, INSTALLATION_ID, '0')).toBe(false);

		const [job] = await claimDpuJobs(INSTALLATION_ID, 1, 30);
		expect(await ackDpuJob(jobId, INSTALLATION_ID, job.claim_generation.toString())).toBe(true);

		const result = await conn.query('SELECT status FROM dpu_jobs WHERE id = $1', [jobId]);
		expect(result.rows[0].status).toBe('completed');
	});

	it('returns failed jobs to pending when retrying', async () => {
		const jobId = await enqueueDpuJob(INSTALLATION_ID, 'install_callback', { installation_code: '123' });
		const [job] = await claimDpuJobs(INSTALLATION_ID, 1, 30);

		expect(await failDpuJob(jobId, INSTALLATION_ID, job.claim_generation.toString(), 'temporary failure')).toBe(true);

		const jobs = await claimDpuJobs(INSTALLATION_ID, 1, 30);
		expect(jobs).toHaveLength(1);
		expect(jobs[0].id.toString()).toBe(jobId);
		expect(jobs[0].attempts).toBe(2);
	});

	it('can mark failed jobs as terminal', async () => {
		const jobId = await enqueueDpuJob(INSTALLATION_ID, 'install_callback', { installation_code: '123' });
		const [job] = await claimDpuJobs(INSTALLATION_ID, 1, 30);

		expect(await failDpuJob(jobId, INSTALLATION_ID, job.claim_generation.toString(), 'permanent failure', false)).toBe(true);
		expect(await claimDpuJobs(INSTALLATION_ID, 1, 30)).toEqual([]);

		const result = await conn.query('SELECT status, last_error FROM dpu_jobs WHERE id = $1', [jobId]);
		expect(result.rows[0]).toEqual({ status: 'failed', last_error: 'permanent failure' });
	});
	it('rejects acknowledgements from an earlier claim generation', async () => {
		const jobId = await enqueueDpuJob(INSTALLATION_ID, 'manual_trigger', { pr_number: '1' });
		const [firstClaim] = await claimDpuJobs(INSTALLATION_ID, 1, -1);
		const [secondClaim] = await claimDpuJobs(INSTALLATION_ID, 1, 30);

		expect(secondClaim.claim_generation).not.toBe(firstClaim.claim_generation);
		expect(await ackDpuJob(jobId, INSTALLATION_ID, firstClaim.claim_generation.toString())).toBe(false);
		expect(await ackDpuJob(jobId, INSTALLATION_ID, secondClaim.claim_generation.toString())).toBe(true);
	});
});
