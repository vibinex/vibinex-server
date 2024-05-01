export function getStrapiURL(path = '') {
	if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
		console.error(
			`[getStrapiURL] NEXT_PUBLIC_STRAPI_API_URL env variable is not set, unable to get strapi URL`);
		throw new Error(`NEXT_PUBLIC_STRAPI_API_URL env variable is not set, unable to get strapi URL`);
	}
	return `http://${process.env.NEXT_PUBLIC_STRAPI_API_URL}${path}`;
}

export function getStrapiMedia(url: string | null) {
	if (url == null) {
		return null;
	}

	// Return the full URL if the media is hosted on an external provider
	if (url.startsWith('http') || url.startsWith('//')) {
		return url;
	}

	// Otherwise prepend the URL path with the Strapi URL
	return `${getStrapiURL()}${url}`;
}

export function formatDate(dateString: string) {
	const date = new Date(dateString);
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
	return date.toLocaleDateString('en-US', options);
}