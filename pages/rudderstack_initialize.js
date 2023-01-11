export async function rudderstack_initialize() {
	window.rudderanalytics = await require("rudder-sdk-js");

	window.rudderanalytics.load(process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY, process.env.NEXT_PUBLIC_RUDDERSTACK_DATA_PLANE_URL, {
		integrations: { All: true }, // load call options
	});

	window.rudderanalytics.ready(() => {
		console.log("we are all set!!!");
	});

	let rudderstackClientSideEvents = {
		identify: (userId, name, email, anonymousId) => {
			console.log("identify");
			window.rudderanalytics.identify({
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
			window.rudderanalytics.track({
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
		page: (type, pageName, properties) => {
			console.log("page");
			window.rudderanalytics.page({
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
