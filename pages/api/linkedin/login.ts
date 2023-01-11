// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getURLWithParams } from '../../../utils/url_utils';

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if ((Object.keys(req.query).length != 0) && ('state' in req.query)) {
		if (req.query.state === process.env.NEXT_PUBLIC_LINKEDIN_STATE) {
			if ('code' in req.query) {
				axios.post("https://www.linkedin.com/oauth/v2/accessToken", {
					grant_type: 'authorization_code',
					code: req.query.code,
					client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
					client_secret: process.env.LINKEDIN_CLIENT_SECRET,
					redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
				}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(post_response => {
					// TODO: store the access token, the ttl and the scope in live-db (firebase)
					axios.defaults.headers.common = {
						Authorization: `Bearer ${post_response.data.access_token}`,
						"Access-Control-Allow-Origin": "*",
					};
					const profilePictureURL = "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))"
					axios.get(profilePictureURL).then((get_response) => {
						// TODO: save the id and the access token
						// TODO: update the name and the profile picture
						function getName(name_obj: {
							localized: { [key: string]: string },
							preferredLocale: {
								country: string,
								language: string,
							}
						}) {
							const preferred_key = `${name_obj.preferredLocale.language}_${name_obj.preferredLocale.country}`;
							return name_obj.localized[preferred_key];
						}
						const url = getURLWithParams('/u', {
							name: getName(get_response.data.firstName) + " " + getName(get_response.data.lastName),
							profilePic: get_response.data.profilePicture['displayImage~'].elements[0].identifiers[0].identifier,
						})
						res.status(200).send(`<script>window.location.href = "${url}"; </script>Redirecting...`);
					}).catch(err => {
						console.error(err.message);
						res.status(500).json({
							error: err,
						})
					})
				}).catch(err => {
					console.error(err.message);
					res.status(500).json({
						error: err,
					})
				})
			} else if ('error' in req.query) {
				window.location.href = '/login/';
			} else {
				res.status(400).send("Bad Request: Unexpected query parameters");
			}
		} else {
			res.status(401).send("Unauthorized request: Please try doing this from a browser");
		}
	} else {
		window.location.href = '/login/';
	}
}
