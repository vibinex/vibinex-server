import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server'
// import { i18n } from './i18n-config';
// import { match as matchLocale } from '@formatjs/intl-localematcher';

const allowedOrigins = [
	"https://vibinex.com",
	"chrome-extension://jafgelpkkkopeaefadkdjcmnicgpcncc", 
	"https://github.com",
	"https://bitbucket.org",
];

const corsOptions = {
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// function getLocale(request: NextRequest): string | undefined {
// 	// Negotiator expects plain object so we need to transform headers
// 	const negotiatorHeaders: Record<string, string> = {};
// 	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

// 	// Use negotiator and intl-localematcher to get best locale
// 	let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
// 	// @ts-ignore locales are readonly
// 	const locales: string[] = i18n.locales;
// 	return matchLocale(languages, locales, i18n.defaultLocale);
// }

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	// Check if the request is for the /api/extensions route
	if (pathname.startsWith('/api/extensions')) {
		// Check the origin from the request
		const origin = request.headers.get('origin') ?? '';
		const isAllowedOrigin = allowedOrigins.includes(origin);

		// Handle preflighted requests
		const isPreflight = request.method === 'OPTIONS';

		if (isPreflight) {
			const preflightHeaders = {
				...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
				...corsOptions,
			}
			return NextResponse.json({}, { headers: preflightHeaders });
		}

		// Handle simple requests
		const response = NextResponse.next();

		if (isAllowedOrigin) {
			response.headers.set('Access-Control-Allow-Origin', origin);
		}

		Object.entries(corsOptions).forEach(([key, value]) => {
			response.headers.set(key, value);
		})

		return response;
	}

	// // If you have one
	// if (
	// 	[
	// 		'/manifest.json',
	// 		'/favicon.ico',
	// 		// Your other files in `public`
	// 	].includes(pathname)
	// )
	// 	return;

	// // Check if there is any supported locale in the pathname
	// const pathnameIsMissingLocale = i18n.locales.every(
	// 	(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
	// );

	// // Redirect if there is no locale
	// if (pathnameIsMissingLocale) {
	// 	const locale = getLocale(request);

	// 	// e.g. incoming request is /products
	// 	// The new URL is now /en-US/products
	// 	return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
	// }
}

export const config = {
	matcher: '/api/extension/:path*',
}