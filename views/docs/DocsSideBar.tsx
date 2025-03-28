import React from 'react';
import SideBar, { SidebarNavItem } from '../../components/SideBar';
import { Session } from 'next-auth';
import DpuHealthChipWithRefresh from '../../components/setup/DpuHealthChipWithRefresh';
import { getAuthUserId } from '../../utils/auth';

const navItems: SidebarNavItem[] = [
	{ label: 'Introduction', href: '/docs' },
	{
		label: 'User Guide',
		href: '',
		children: [
			{ label: 'Getting Started', href: '/docs/setup/providerLogin' },
			{
				label: 'Troubleshooting', href: '/docs/troubleshooting', children: [
					{ label: 'Unable to run docker command', href: '/docs/troubleshooting/unable-to-run-docker-command' },
					{ label: 'Starting a VM in your cloud provider', href: '/docs/troubleshooting/starting-vm-in-cloud' },
				]
			},
		],
	},
	{
		label: 'Contributor Guide',
		href: '',
		children: [
			{ label: 'Overview', href: '/docs/contributor-guide' },
			{ label: 'Server Setup', href: '/docs/contributor-guide/server-setup' },
			{ label: 'Modifying the browser extension', href: '/docs/contributor-guide/extension-setup' },
			{ label: 'Environment Setup for DPU', href: '/docs/contributor-guide/dpu-setup' },
			// Add more developer-specific items here
		],
	},
];

const DocsSideBar: React.FC<{ className?: string, session?: Session | null }> = ({ className, session }) => {
	return (
		<div className={className}>
			<SideBar navItems={navItems} />
			{(session) ? <DpuHealthChipWithRefresh userId={getAuthUserId(session)} /> : null}
		</ div>
	);
};

export default DocsSideBar;
