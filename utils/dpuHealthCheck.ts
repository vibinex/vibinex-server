import { dpuHealthCheckStatus, setDpuHealthCheckStatusOnline } from "./db/healthCheck";
import { publishMessage } from "./pubsub/pubsubClient";

export const dpuHealthCheck = async (topicId: string): Promise<boolean> => {
	const msgType = "health_check";
	// Set health check status to false
	await setDpuHealthCheckStatusOnline(topicId, false);
	await publishMessage(topicId, {}, msgType);
	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	console.debug("[dpuHealthCheck] Waiting for 10 seconds for DPU to update health");
	await sleep(10000);
	const healthStatus = await dpuHealthCheckStatus(topicId);
	return healthStatus;
}