import Analytics from "@rudderstack/rudder-sdk-node";
import { apiObject } from "rudder-sdk-js";
// we need the batch endpoint of the Rudder server you are running
const client = (process.env.NODE_ENV === 'development') ? {
	identify: (event_properties: object) => console.info("[mock-rs] identify", event_properties),
	track: (event_properties: object) => console.info("[mock-rs] track", event_properties)
} : new Analytics(process.env.RUDDERSTACK_SERVER_WRITE_KEY!, { dataPlaneUrl: process.env.RUDDERSTACK_SERVER_DATA_PLANE_URL });

const asyncWrapper = (fn: Function, ...args: any[]) => {
    return new Promise<void>((resolve) => {
        setImmediate(() => {
            fn(...args);
            resolve();
        });
    });
};

const rudderStackEvents = {
    identify: (userId: string, name: string, email: string, githubId: string, role: string, anonymousId: string) => {
        console.debug("[rudderstack] identify event initiated");
        asyncWrapper(client.identify, {
            userId: userId,
            anonymousId: anonymousId,
            traits: {
                name: name,
                email: email,
                githubId: githubId,
                role: role
            }
        }, () => { console.debug("[rudderstack] identify event successfully recorded") });
    },
	/**
	 * @param {*} properties properties should be a dictionary of properties of the event. It must contain an "eventStatusFlag" which will define the status of a single event. If the flag is 1, event is successful and if it is 0, event is failed.
	 */
    track: (userId: string, anonymousId: string, event: string, properties: apiObject) => {
        console.debug("[rudderstack] track event initiated");
        asyncWrapper(client.track, {
            userId: userId,
            anonymousId: anonymousId,
            event: event,
            properties: properties,
            timestamp: new Date(),
        }, () => { console.debug("[rudderstack] Track event successfully recorded") });
    }
}
export default rudderStackEvents;