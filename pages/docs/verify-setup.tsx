const verifySetup = [
	"In your organization's repository list, you will see the Vibinex logo in front of the repositories that are correctly set up with Vibinex.",
	"On the pull requests page, the relevant ones will get highlighted in yellow, with details that help you choose where to start",
	"Inside the pull request, where you can see the file changes, you will see the parts that are relevant for you highlighted in yellow."
]

const VerifySetup = () => (
	<>
		<h2 className='text-xl mt-4 mb-2 font-semibold'>Verify your setup</h2>
		Once you have set up your repositories, installed the browser extension and signed in, you can verify if everything is correctly set up.
		<ol className="list-decimal list-inside">
			{verifySetup.map((checkItem, index) => (<li key={index} className='mt-2 ml-1 list-item'>
				{checkItem}
			</li>))}
		</ol>
	</>
)

export default VerifySetup;