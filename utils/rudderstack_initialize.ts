import { v4 as uuidv4 } from "uuid";

export interface RudderstackClientSideEvents {
	identify: (
		userId: string,
		name: string,
		email: string,
		anonymousId: string
	) => void;
	track: (
		userId: string,
		event: string,
		properties: { [key: string]: any },
		anonymousId: string
	) => void;
	page: (
		type: string,
		pageName: string,
		properties: { [key: string]: any }
	) => void;
}

async function loadRudderAnalytics(): Promise<RudderstackClientSideEvents | null> {
	if (typeof window === "undefined") { // do nothing on server-side
		return null;
	}

	const mockAnalyticsObject: RudderstackClientSideEvents = {
		identify: (...args) => { console.debug(`[identify] args:`, args) },
		track: (...args) => { console.debug(`[track] args:`, args) },
		page: (...args) => { console.debug(`[page] args:`, args) }
	}

	if (process.env.NODE_ENV === 'development') { // create dummy methods in development environment
		console.warn('Running in development mode. Rudder Analytics is not loaded.')
		return mockAnalyticsObject
	}

	const rudderstackClientSideEvents = await import("rudder-sdk-js").then(rudderAnalytics => {
		rudderAnalytics.load(
			process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_WRITE_KEY!,
			process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_DATAPLANE_URL!,
			{
				integrations: { All: true }, // load call options
			}
		);

		rudderAnalytics.ready(() => {
			console.debug("Rudder Analytics is all set!!!");
		});

		const rsClientSideEvents: RudderstackClientSideEvents = {
			identify: (userId, name, email, anonymousId) => {  // Anonymous Id is set in local storage as soon as a user lands on the webiste.
				console.debug("identify");
				rudderAnalytics.identify(
					userId,
					{ name: name, email: email },
					{ anonymousId: anonymousId },
					() => {
						console.debug("identify event successfully recorded");
					}
				);
			},
			/**
			 * @param {*} properties properties should be a dictionary of properties of the event. It must contain an "eventStatusFlag" which will define the status of a single event. If the flag is 1, event is successful and if it is 0, event is failed.
			 */
			track: (userId, event, properties, anonymousId) => {
				console.debug("track");
				properties["userId"] = userId;
				properties["event_timestamp"] = new Date();
				rudderAnalytics.track(
					event,
					properties,
					{ anonymousId: anonymousId },
					() => {
						console.debug("Track event successfully recorded");
					}
				);
			},
			page: (type, pageName, properties) => {
				//TODO: Rudderstack doesn't take `userId` or `anonymousId` as arguments to page method but then does it makes sense to use this method? Figure out.
				console.debug("page");
				rudderAnalytics.page(
					type,
					pageName,
					properties,
					() => {
						console.debug("Page event successfully recorded");
					}
				);
			},
		};
		return rsClientSideEvents;
	}).catch(err => {
		console.error("ERROR: Could not load the Rudderstack SDK", err);
		return mockAnalyticsObject;
	});
	return rudderstackClientSideEvents;
}

export async function rudderEventMethods(): Promise<RudderstackClientSideEvents | null> {
	const rudderAnalytics = await loadRudderAnalytics()
	return rudderAnalytics
}

export const getAndSetAnonymousIdFromLocalStorage = () => {
	const localStorageAnonymousId = localStorage.getItem('AnonymousId');
	const anonymousId: string = (localStorageAnonymousId && localStorageAnonymousId != null) ? localStorageAnonymousId : uuidv4();
	localStorage.setItem('AnonymousId', anonymousId);
	return anonymousId;
}