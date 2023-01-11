export async function rudderstack_initialize() {
	window.rudderanalytics = await require("rudder-sdk-js");

	window.rudderanalytics.load(process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY, process.env.NEXT_PUBLIC_RUDDERSTACK_DATA_PLANE_URL, {
		integrations: { All: true }, // load call options
	});

	window.rudderanalytics.ready(() => {
		console.log("we are all set!!!");
	});
}
