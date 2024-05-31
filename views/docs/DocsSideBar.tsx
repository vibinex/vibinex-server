import React from 'react';
import SideBar, { SidebarNavItem } from '../../components/SideBar';

const navItems: SidebarNavItem[] = [
	{ label: 'Introduction', href: '/docs' },
	{
		label: 'User Guide',
		href: '',
		children: [
			{ label: 'Getting Started', href: '/docs/quickstart' },
			{ label: 'Installation for GitHub', href: '/docs/github-installation' },
			{ label: 'Installation for Bitbucket', href: '/docs/bitbucket-installation' },
			{
				label: 'Troubleshooting', href: '/docs/troubleshooting', children: [
					{ label: 'Unable to run docker command', href: '/docs/troubleshooting/unable-to-run-docker-command' },
					{ label: 'Starting a VM in your cloud provider', href: '/docs/troubleshooting/starting-vm-in-cloud' },
				]
			},
		],
	},
	{
		label: 'Developer Guide',
		href: '',
		children: [
			{ label: 'Overview', href: '/docs/developer-guide' },
			{ label: 'Environment Setup', href: '/docs/developer-guide/environment-setup' },
			{ label: 'Code Overview', href: '/docs/developer-guide/code-overview' },
			{ label: 'Contribution Guide', href: '/docs/developer-guide/contribution-guide' },
			// Add more developer-specific items here
		],
	},
];

const DocsSideBar: React.FC<{ className?: string }> = ({ className }) => {
	return <SideBar navItems={navItems} className={className} />;
};

export default DocsSideBar;
