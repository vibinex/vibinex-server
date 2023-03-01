import Analytics from "@rudderstack/rudder-sdk-node";
import { apiObject } from "rudder-sdk-js";
//TODO: Move these credentials to either .env or a more secure location. best way would be to store these credentials in a file.
const WRITE_KEY = "1uJFicTY48cFtZPIKyLqILECDt1";
const DATA_PLANE_URL = "https://gmailaviksslp.dataplane.rudderstack.com";

// we need the batch endpoint of the Rudder server you are running
const client = new Analytics(WRITE_KEY,  { dataPlaneUrl: DATA_PLANE_URL });

const rudderStackEvents = {
    identify: (userId: string, name: string, email: string, githubId: string, role: string, anonymousId: string) => {
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
        },  () => { console.log("identify event successfully recorded") }
        );
    },
    /**
     * @param {*} properties properties should be a dictionary of properties of the event. It must contain an "eventStatusFlag" which will define the status of a single event. If the flag is 1, event is successful and if it is 0, event is failed.
     */
    track: (userId: string, anonymousId: string, event: string, properties: apiObject) => {
        console.log("track");
        client.track({
            userId: userId,
            anonymousId: anonymousId,
            event: event,
            properties: properties,
            timestamp: new Date(),
        }, () => { console.log("Track event successfully recorded") }
        );
    }
}

export default rudderStackEvents;