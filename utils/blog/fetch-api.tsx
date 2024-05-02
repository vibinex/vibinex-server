import axios from "axios";
import qs from "qs";
import { getStrapiURL } from "./api-helpers";

export async function fetchAPI(
	path: string,
	urlParamsObject = {},
	options = {}
) {
	try {
		// Merge default and user options
		const mergedOptions = {
			next: { revalidate: 60 },
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
			},
			...options,
		};

		// Build request URL
		const queryString = qs.stringify(urlParamsObject);
		const urlPath = queryString
			? `/api${path}?${queryString}`
			: `/api${path}`;
		const requestUrl = `${getStrapiURL(urlPath)}`;

		// Trigger API call using Axios
		const response = await axios(requestUrl, mergedOptions);
		return response.data;
	} catch (error) {
		console.error(`[fetchApi] Unable to call api ${path}`, err);
		throw new Error(
			`Please check if your server is running and you set all the required tokens.`
		);
	}
}
