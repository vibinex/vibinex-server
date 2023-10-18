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

export default constructHtml;