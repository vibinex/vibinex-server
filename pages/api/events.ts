import Analytics from "@rudderstack/rudder-sdk-node";
import { apiObject } from "rudder-sdk-js";
// we need the batch endpoint of the Rudder server you are running
const client = (process.env.NODE_ENV === 'development') ? {
	identify: (event_properties: object) => console.info(event_properties),
	track: (event_properties: object) => console.info(event_properties)
} : new Analytics(process.env.RUDDERSTACK_SERVER_WRITE_KEY!, { dataPlaneUrl: process.env.RUDDERSTACK_SERVER_DATA_PLANE_URL });

const rudderStackEvents = {
	identify: (userId: string, name: string, email: string, githubId: string, role: string, anonymousId: string) => { // Anonymous Id is set in local storage as soon as a user lands on the website.
		console.debug("[rudderstack] identify event initiated");
		client.identify({
			userId: userId,
			anonymousId: anonymousId,
			traits: {
				name: name,
				email: email,
				githubId: githubId,
				role: role
			}
		}, () => { console.debug("[rudderstack] identify event successfully recorded") }
		);
	},
	/**
	 * @param {*} properties properties should be a dictionary of properties of the event. It must contain an "eventStatusFlag" which will define the status of a single event. If the flag is 1, event is successful and if it is 0, event is failed.
	 */
	track: (userId: string, anonymousId: string, event: string, properties: apiObject) => {
		console.debug("[rudderstack] track event initiated");
		client.track({
			userId: userId,
			anonymousId: anonymousId,
			event: event,
			properties: properties,
			timestamp: new Date(),
		}, () => { console.debug("[rudderstack] Track event successfully recorded") }
		);
	}
}

export default rudderStackEvents;