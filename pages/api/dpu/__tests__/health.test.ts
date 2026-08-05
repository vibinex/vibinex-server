import type { NextApiRequest, NextApiResponse } from "next";
import healthHandler from "../health";
import { saveHealthStatusToDB } from "../../../../utils/db/healthStatus";

jest.mock("../../../../utils/db/healthStatus", () => ({
	saveHealthStatusToDB: jest.fn(),
}));

const mockedSave = saveHealthStatusToDB as jest.MockedFunction<typeof saveHealthStatusToDB>;

const makeResponse = () => {
	const res = {
		status: jest.fn(),
		json: jest.fn(),
		setHeader: jest.fn(),
	} as unknown as NextApiResponse;
	(res.status as jest.Mock).mockReturnValue(res);
	(res.json as jest.Mock).mockReturnValue(res);
	return res;
};

const makeRequest = (overrides: Partial<NextApiRequest> = {}) => ({
	method: "POST",
	headers: { authorization: "Bearer test-token", "x-request-id": "request-123" },
	body: { status: "SUCCESS", timestamp: new Date().toISOString(), topic: "topic-installation-1" },
	...overrides,
} as NextApiRequest);

describe("DPU health handler", () => {
	beforeEach(() => {
		process.env.DPU_AUTH_TOKEN = "test-token";
		mockedSave.mockReset();
	});

	it("rejects methods other than POST and advertises POST", async () => {
		const res = makeResponse();
		await healthHandler(makeRequest({ method: "GET" }), res);
		expect(res.setHeader).toHaveBeenCalledWith("Allow", "POST");
		expect(res.status).toHaveBeenCalledWith(405);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "METHOD_NOT_ALLOWED" }));
		expect(mockedSave).not.toHaveBeenCalled();
	});

	it("rejects unauthenticated requests", async () => {
		const res = makeResponse();
		await healthHandler(makeRequest({ headers: { "x-request-id": "request-123" } }), res);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "UNAUTHORIZED", requestId: "request-123" }));
	});

	it("returns a structured error when DPU authentication is not configured", async () => {
		delete process.env.DPU_AUTH_TOKEN;
		const res = makeResponse();
		await healthHandler(makeRequest(), res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
			code: "DPU_AUTH_NOT_CONFIGURED",
			message: "DPU auth is not configured",
			requestId: "request-123",
		}));
	});

	it.each([
		[new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()],
		[new Date(Date.now() + 6 * 60 * 1000).toISOString()],
	])("rejects stale or future client timestamps", async (timestamp) => {
		const res = makeResponse();
		await healthHandler(makeRequest({ body: {
			status: "SUCCESS",
			timestamp,
			topic: "topic-installation-1",
		} }), res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "INVALID_REQUEST" }));
		expect(mockedSave).not.toHaveBeenCalled();
	});

	it.each([
		[{ status: "UNKNOWN", timestamp: new Date().toISOString(), topic: "topic-1" }, "status"],
		[{ status: "SUCCESS", timestamp: "not-a-date", topic: "topic-1" }, "timestamp"],
		[{ status: "SUCCESS", timestamp: new Date().toISOString(), topic: "topic with spaces" }, "topic"],
	])("rejects invalid payloads", async (body, field) => {
		const res = makeResponse();
		await healthHandler(makeRequest({ body }), res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
			code: "INVALID_REQUEST",
			details: expect.objectContaining({ [field]: expect.any(String) }),
		}));
		expect(mockedSave).not.toHaveBeenCalled();
	});

	it("accepts RFC-3339 UTC offsets used by the DPU", async () => {
		mockedSave.mockResolvedValueOnce(new Date());
		const res = makeResponse();
		await healthHandler(makeRequest({ body: {
			status: "SUCCESS",
			timestamp: new Date().toISOString().replace("Z", "+00:00"),
			topic: "topic-installation-1",
		} }), res);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("returns 404 when the authenticated topic does not match an installation", async () => {
		mockedSave.mockResolvedValueOnce(null);
		const res = makeResponse();
		await healthHandler(makeRequest(), res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "INSTALLATION_NOT_FOUND" }));
	});

	it("returns 500 exactly once when persistence fails", async () => {
		mockedSave.mockRejectedValueOnce(new Error("database unavailable"));
		const res = makeResponse();
		await healthHandler(makeRequest(), res);
		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledTimes(1);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "PERSISTENCE_ERROR" }));
	});

	it("persists a server timestamp and returns success once", async () => {
		const persistedAt = new Date();
		mockedSave.mockResolvedValueOnce(persistedAt);
		const res = makeResponse();
		await healthHandler(makeRequest(), res);
		expect(mockedSave).toHaveBeenCalledWith("SUCCESS", "topic-installation-1");
		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledTimes(1);
	});
});
