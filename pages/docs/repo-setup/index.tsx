import Link from "next/link";

const RepoSetup = () => (<>
	<h2 className='text-xl mt-4 mb-2 font-semibold'>Setup your repository for Vibinex</h2>
	<p>Setting up your repository requires two steps:</p>
	<ol className="list-decimal list-inside">
		<li className="list-item mt-4 font-sans">Adding the repo-profiler to your CI pipeline</li>
		<li className="list-item mt-4 font-sans">Setting up the trigger to run it on every pull-request</li>
	</ol>
	<iframe src="https://www.youtube.com/embed/_YC2vwLuKRg"
		width="560" height="315"
		title="YouTube video player"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		className="mx-auto px-4 w-full my-4"
		allowFullScreen></iframe>

	<p className="mt-8">You can find details of each environment here:</p>
	<ul className="list-inside list-disc">
		<li className="list-item mt-4 font-sans"><Link href="/docs/repo-setup/github" className="hover:underline text-primary-main">GitHub with GitHub Actions</Link></li>
		<li className="list-item mt-4 font-sans"><Link href="/docs/repo-setup/bitbucket" className="hover:underline text-primary-main">Bitbucket with Bitbucket Pipelines</Link></li>
	</ul>
</>)

export default RepoSetup;