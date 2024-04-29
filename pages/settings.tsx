import * as Tabs from '@radix-ui/react-tabs';
import Footer from "../components/Footer";
import GitAliasForm from "../components/GitAliasForm";
import MainAppBar from "../views/MainAppBar";

const ExpandedGitAliasFormPage: React.FC = () => {
	return <>
		<MainAppBar />
		<h1 className="w-full text-center text-2xl py-4 font-semibold border-b">
			Account Settings
		</h1>
		
		<Tabs.Root 
			defaultValue="alias-form" 
			orientation="vertical" 
			className="flex w-full md:w-4/5 mx-auto my-4"
		>
		<Tabs.List className="shrink flex flex-col w-64" aria-label="Account settings">
			<Tabs.Trigger value="alias-form" className="bg-white py-2 h-11 flex-1 flex grow-0 ps-4 items-center justify-start text-sm leading-none select-none rounded-s-md hover:bg-secondary-main/50 data-[state=active]:text-primary-main data-[state=active]:font-medium data-[state=active]:bg-secondary-main outline-none cursor-default">
				Missing Aliases
			</Tabs.Trigger>
			<Tabs.Trigger value="feature-flags" className="bg-white py-2 h-11 flex-1 flex grow-0 ps-4 items-center justify-start text-sm leading-none select-none rounded-s-md hover:bg-secondary-main/50 data-[state=active]:text-primary-main data-[state=active]:font-medium data-[state=active]:bg-secondary-main outline-none cursor-default">
				Feature Flags
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="alias-form" className="grow px-5 bg-white rounded-r-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black">
			<GitAliasForm expanded={true} />
		</Tabs.Content>
		<Tabs.Content value="feature-flags" className="grow px-5 bg-white rounded-r-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black">
			{/* <RepoList /> */}
			RepoList
		</Tabs.Content>
		</Tabs.Root>
		<Footer />
		</>
};

export default ExpandedGitAliasFormPage;
