const Analytics = require("@rudderstack/rudder-sdk-node");
//TODO: Move these credentials to either .env or a more secure location.
const WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_SERVER_WRITE_KEY;
const DATA_PLANE_URL = NEXT_PUBLIC_RUDDERSTACK_SERVER_DATA_PLANE_URL;

// we need the batch endpoint of the Rudder server you are running
const client = new Analytics(WRITE_KEY, DATA_PLANE_URL);

exports.rudderStackEvents = {
    identify: (userId, name, email, githubId, role, anonymousId) => {
        console.log("identify");
        client.identify({
            userId: userId,
            anonymousId: anonymousId,
            traits: {
                name: name,
                email: email,
                githubId: githubId,
                role: role
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
        client.track({
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
    }
}
