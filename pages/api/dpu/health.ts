import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { saveHealthStatusToDB } from "../../../utils/db/healthStatus";
import { validateDpuAuth } from "../../../utils/dpuAuth";

const HEALTH_STATUSES = new Set(["START", "FAILED", "SUCCESS", "INACTIVE"]);
const TOPIC_PATTERN = /^[A-Za-z0-9._:-]{1,200}$/;
const ISO_8601_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const MAX_HEARTBEAT_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;

type ErrorCode =
	| "METHOD_NOT_ALLOWED"
	| "INVALID_REQUEST"
	| "INSTALLATION_NOT_FOUND"
	| "PERSISTENCE_ERROR";

const sendError = (
	res: NextApiResponse,
	status: number,
	code: ErrorCode,
	message: string,
	requestId: string,
	details?: Record<string, string>,
) => res.status(status).json({ code, message, requestId, ...(details ? { details } : {}) });

const getRequestId = (req: NextApiRequest) => {
	const header = req.headers["x-request-id"];
	const candidate = Array.isArray(header) ? header[0] : header;
	return candidate && /^[A-Za-z0-9._:-]{1,128}$/.test(candidate) ? candidate : randomUUID();
};

const healthHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const requestId = getRequestId(req);
	res.setHeader("x-request-id", requestId);

	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is supported", requestId);
	}
	if (!validateDpuAuth(req, res, requestId)) return;

	const body = req.body && typeof req.body === "object" ? req.body : {};
	const { status, timestamp, topic } = body;
	if (typeof status !== "string" || !HEALTH_STATUSES.has(status)) {
		return sendError(res, 400, "INVALID_REQUEST", "Invalid heartbeat payload", requestId, {
			status: "Must be one of START, FAILED, SUCCESS, or INACTIVE",
		});
	}
	if (typeof topic !== "string" || !TOPIC_PATTERN.test(topic)) {
		return sendError(res, 400, "INVALID_REQUEST", "Invalid heartbeat payload", requestId, {
			topic: "Must be 1-200 URL-safe identity characters",
		});
	}
	if (typeof timestamp !== "string" || !ISO_8601_TIMESTAMP_PATTERN.test(timestamp)) {
		return sendError(res, 400, "INVALID_REQUEST", "Invalid heartbeat payload", requestId, {
			timestamp: "Must be an ISO-8601 string",
		});
	}
	const clientTimestamp = new Date(timestamp);
	const now = new Date();
	if (Number.isNaN(clientTimestamp.getTime())) {
		return sendError(res, 400, "INVALID_REQUEST", "Invalid heartbeat payload", requestId, {
			timestamp: "Must be a valid ISO-8601 timestamp",
		});
	}
	const ageMs = now.getTime() - clientTimestamp.getTime();
	if (ageMs > MAX_HEARTBEAT_AGE_MS || ageMs < -MAX_FUTURE_SKEW_MS) {
		return sendError(res, 400, "INVALID_REQUEST", "Invalid heartbeat payload", requestId, {
			timestamp: "Must be within the last 24 hours and no more than 5 minutes in the future",
		});
	}

	let persistedAt: Date;
	try {
		const savedAt = await saveHealthStatusToDB(status, topic);
		if (!savedAt) {
			return sendError(res, 404, "INSTALLATION_NOT_FOUND", "No installation matches this topic", requestId);
		}
		persistedAt = new Date(savedAt);
	} catch (error) {
		console.error(`[healthHandler] Persistence failed requestId=${requestId} topic=${topic}`);
		return sendError(res, 500, "PERSISTENCE_ERROR", "Unable to persist heartbeat", requestId);
	}

	return res.status(200).json({ status: "Success", requestId, receivedAt: persistedAt.toISOString() });
};

export default healthHandler;
