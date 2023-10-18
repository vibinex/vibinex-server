import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';

const installHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const topicName = process.env.TOPIC_NAME;
	if (topicName) {
		const data = {
			'repository_provider': 'bitbucket',
			'installation_code': req.query.code
		};
		const msgType = 'install_callback';
		console.info("Recieved installation code for bitbucket, published to ", topicName);
		try {
			res.write(constructHtml("Starting installation...<br><small>This may take some time. Please be patient.</small>"));
			await publishMessage(topicName, data, msgType);
		} catch (error) {
			console.error('Error publishing message:', error);
			res.status(500).send(constructHtml("ERROR: Failed to publish message. Data must be in the form of a Buffer.<br>Redirecting...", "error"));
		}
	} else {
		console.error('TOPIC_NAME not set');
		res.status(500).send(constructHtml("ERROR: Failed to publish message.<br>Redirecting...", "error"));
	}
	res.write(
		`<script>
			location.href="/u"
		</script>\
		If you are not automatically redirected, <a href="/u">click here</a>`
	);
	res.end();
}

const constructHtml = (text: string, type: 'info' | 'error' = 'info') => {
	return (
		`<!DOCTYPE html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<style>
					#overlay {
						position: fixed;
						display: block;
						width: 100%;
						height: 100%;
						top: 0;
						left: 0;
						z-index: 2;
					}

					#infoText{
						position: relative;
						top: 50%;
						left: 50%;
						font-size: 24px;
						color: #f3f4f6;
						transform: translate(-50%,-50%);
						-ms-transform: translate(-50%,-50%);
					}

					#spinner {
						display: inline-block;
						position: absolute;
						top: 35%;
						left: 45%;
						width: 70px;
						height: 70px;
						border: 5px solid rgba(0,0,0,.3);
						border-radius: 50%;
						border-top-color: #f3f4f6;
						animation: spin 1s ease-in-out infinite;
						-webkit-animation: spin 1s ease-in-out infinite;
					}

					@keyframes spin {
						to { -webkit-transform: rotate(360deg); }
					}
					@-webkit-keyframes spin {
						to { -webkit-transform: rotate(360deg); }
					}

					#error-symbol {
						display: inline-block;
						position: absolute;
						top: 35%;
						left: 45%;
						width: 70px;
						height: 70px;
						background-color: #f44336;
						border-radius: 50%;
						border: 1px solid #f3f4f6;
					}
					
					#error-symbol::before,
					#error-symbol::after {
						content: '';
						position: absolute;
						top: 50%;
						left: 50%;
						width: 10px;
						height: 40px;
						background-color: #fff;
					}
					
					#error-symbol::before {
						transform: translate(-50%, -50%) rotate(45deg);
					}
					
					#error-symbol::after {
						transform: translate(-50%, -50%) rotate(-45deg);
					}
				</style>
			</head>
			<body bgcolor="#2196F3">
				<div id="overlay">
					<div id="infoText">
						<center>${text}</center>
					</div>
					${(type === 'info') ? '<div id="spinner"></div>' : '<div id="error-symbol"></div>'}
				</div>
			</body>
		</html> `
	)
}

export default installHandler;