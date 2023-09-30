// text-encoder-polyfill.js
if (typeof TextEncoder === 'undefined') {
	global.TextEncoder = require('util').TextEncoder;
}
