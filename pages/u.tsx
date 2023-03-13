import { useSession } from "next-auth/react";
import Link from "next/link";
import LoadingOverlay from "../components/LoadingOverlay";
import MainAppBar from "../views/MainAppBar";

const Profile = () => {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (<LoadingOverlay />)
	} else if (status === 'unauthenticated') {
		window.location.href = "/";
		return (<LoadingOverlay text="You are not authenticated. Redirecting..." />)
	}

	return (
		<>
			<MainAppBar />
			<p>Hi {session?.user?.name}, This is your developer profile</p>
			<p>
				To add metadata for more repositories, visit the
				<Link href={"/upload"} className="text-primary-main"> upload page</Link>
			</p>
		</>
	)
}

export default Profile;