import { useSession } from "next-auth/react";
import Link from "next/link";
import MainAppBar from "../views/MainAppBar";

const Profile = () => {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (<p>Loading...</p>)
	} else if (status === 'unauthenticated') {
		window.location.href = "/";
		return (<p>You are not authenticated. Redirecting...</p>)
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