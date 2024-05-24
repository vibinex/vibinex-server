import * as Tabs from '@radix-ui/react-tabs';
import Footer from "../components/Footer";
import AppearanceSettings from '../views/AppearanceSettings';
import GitAliasForm from "../views/GitAliasForm";
import MainAppBar from "../views/MainAppBar";
import RepoList from '../views/RepoList';

const ExpandedGitAliasFormPage: React.FC = () => {
	const tabTriggerClassNames = "py-2 h-11 flex-1 flex grow-0 ps-4 items-center justify-start text-sm leading-none select-none rounded-s-md hover:bg-primary/50 data-[state=active]:text-primary-main data-[state=active]:font-medium data-[state=active]:bg-primary outline-none cursor-default";
	const tabContentClassNames = "grow px-5 bg-background rounded-r-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black";
	return <>
		<MainAppBar />
		<h1 className="w-full text-center text-2xl py-4 font-semibold border-b border-border">
			Account Settings
		</h1>

		<Tabs.Root
			defaultValue="alias-form"
			orientation="vertical"
			className="flex flex-col md:flex-row w-full md:w-4/5 mx-auto my-4"
		>
			<Tabs.List className="shrink flex flex-col w-full md:w-64 pb-4 mb-4 border-b-2 border-border md:border-0 gap-2" aria-label="Account settings">
				<Tabs.Trigger value="alias-form" className={tabTriggerClassNames}>
					Missing Aliases
				</Tabs.Trigger>
				<Tabs.Trigger value="feature-flags" className={tabTriggerClassNames}>
					Feature Flags
				</Tabs.Trigger>
				<Tabs.Trigger value='appearance' className={tabTriggerClassNames}>
					Appearance
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="alias-form" className={tabContentClassNames}>
				<GitAliasForm expanded={true} />
			</Tabs.Content>
			<Tabs.Content value="feature-flags" className={tabContentClassNames}>
				<RepoList />
			</Tabs.Content>
			<Tabs.Content value="appearance" className={tabContentClassNames}>
				<AppearanceSettings />
			</Tabs.Content>
		</Tabs.Root>
		<Footer />
	</>
};

export default ExpandedGitAliasFormPage;
