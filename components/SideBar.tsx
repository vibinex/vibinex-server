import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

export interface SidebarNavItem {
	label: string;
	href: string;
	children?: SidebarNavItem[];
}

interface SideBarProps {
	navItems: SidebarNavItem[];
	className?: string;
}

const SideBar: React.FC<SideBarProps> = ({ navItems = [], className }) => {
	const router = useRouter();
	const itemClassName = (isActive: boolean) => `block px-4 !py-2 my-1 rounded-md hover:no-underline font-normal ${isActive
		? 'text-secondary bg-primary'
		: 'hover:bg-primary/50'
		}`;

	const renderNavItem = (item: SidebarNavItem) => {
		if (!item.children) {
			return (
				<Link
					href={item.href}
					key={item.label}
					className={itemClassName(router.pathname === item.href)}
				>
					{item.label}
				</Link>
			);
		}

		return (
			<AccordionItem value={item.label} key={item.label} className="border-b-0 px-0">
				<AccordionTrigger className={itemClassName(router.pathname === item.href)}>
					<Link href={item.href}>
						{item.label}
					</Link>
				</AccordionTrigger>
				<AccordionContent>
					<ul className="ml-4">
						{item.children.map((child) => renderNavItem(child))}
					</ul>
				</AccordionContent>
			</AccordionItem>
		);
	};

	return (
		<div className={`bg-background p-4 rounded-lg ${className ?? ''}`}>
			<h3 className="text-lg font-semibold mb-4">Documentation</h3>
			<nav>
				<Accordion type="multiple" className=''>
					{navItems.map((item) => renderNavItem(item))}
				</Accordion>
			</nav>
		</div>
	);
};

export default SideBar;
