export async function rudderstack_initialize() {
	let rudderAnalytics = await import("rudder-sdk-js");

	rudderAnalytics.load(process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_WRITE_KEY, process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_DATA_PLANE_URL, {
		integrations: { All: true }, // load call options
	});

	rudderAnalytics.ready(() => {
		console.log("we are all set!!!");
	});
	return rudderAnalytics;
}

export async function rudderEventMethods() {
	let rudderAnalytics = await rudderstack_initialize();
	let rudderstackClientSideEvents = {
		identify: (userId, name, email, anonymousId) => {
			console.log("identify");
			rudderAnalytics.identify({
				userId: userId,
				anonymousId: anonymousId,
				traits: {
					name: name,
					email: email,
				}
			},  function(err) {
					if(err) {
						console.log("Error message: ", err)
					}
				}
			);
		},
		/**
		 * @param {*} properties properties should be a dictionary of properties of the event. It must contain an "eventStatusFlag" which will define the status of a single event. If the flag is 1, event is successful and if it is 0, event is failed.
		 */
		track: (userId, event, properties, anonymousId) => {
			console.log("track");
			window.rudderAnalytics.track({
				userId: userId,
				anonymousId: anonymousId,
				event: event,
				properties: properties,
				timestamp: new Date(),
			}, function(err) {
					if(err) {
						console.log("Error message: ", err)
					}
				}
			);
		},
		page: (type, pageName, properties) => { //TODO: Rudderstack doesn't take `userId` or `anonymousId` as arguments to page method but then does it makes sense to use this method? Figure out.
			console.log("page");
			rudderAnalytics.page({
				type: type,
				name: pageName,
				properties: properties
			}, function(err) {
				if(err) {
					console.log("Error message: ", err)
				}
			})
		}
	}
	return rudderstackClientSideEvents;
}
