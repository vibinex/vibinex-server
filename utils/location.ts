
// Function to fetch the user's location using the geolocation API
export function getUserLocation() {
	return new Promise<GeolocationPosition>((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(resolve, reject);
		} else {
			reject(new Error('Geolocation is not supported by this browser.'));
		}
	});
}

// Function to determine if the user is in India based on their location
export function isUserInIndia(position?: GeolocationPosition) {
	if (!position) {
		return false; // default to not-in-India
	}

	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;

	// Implement your logic to determine if the coordinates are within India's boundaries
	// You can use external APIs or geospatial calculations to check if the coordinates fall within India

	// Example logic: Checking if the latitude and longitude are within a rough bounding box of India
	const isLatitudeInRange = latitude >= 6.755 && latitude <= 35.674;
	const isLongitudeInRange = longitude >= 68.111 && longitude <= 97.395;

	return isLatitudeInRange && isLongitudeInRange;
}