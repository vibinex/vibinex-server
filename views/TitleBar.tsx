import Link from "next/link"
import AppBar from "../components/AppBar"

const TitleBar = () => (
	<AppBar position='fixed' className='bg-primary-light pl-8 border-b'>
		<Link href='/'>
			<h1 className='font-bold text-4xl'>
				Vibinex
			</h1>
		</Link>
	</AppBar>
)

export default TitleBar;