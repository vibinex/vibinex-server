import { classifyHealthStatus } from "../healthStatus";

describe("classifyHealthStatus", () => {
	const now = new Date("2026-08-05T04:30:00.000Z");

	it("distinguishes healthy, stale, never-seen, and error states", () => {
		expect(classifyHealthStatus("SUCCESS", "2026-08-05T04:29:00.000Z", now)).toBe("healthy");
		expect(classifyHealthStatus("SUCCESS", "2026-08-05T04:20:00.000Z", now)).toBe("stale");
		expect(classifyHealthStatus(null, null, now)).toBe("never-seen");
		expect(classifyHealthStatus("FAILED", "2026-08-05T04:29:00.000Z", now)).toBe("error");
		expect(classifyHealthStatus("SUCCESS", "invalid", now)).toBe("error");
	});

	it("classifies an old failed heartbeat as an error", () => {
		expect(classifyHealthStatus("FAILED", "2026-08-05T04:20:00.000Z", now)).toBe("error");
	});
});
