import { GetStaticProps } from 'next';
import Link from 'next/link';
import path from 'path';
import fs from 'fs';
import MainAppBar from '../../../views/MainAppBar';
import Footer from '../../../components/Footer';
import DocsSideBar from '../../../views/docs/DocsSideBar';

interface TroubleshootingPageProps {
	pages: string[];
}

export default function TroubleshootingPages({ pages }: TroubleshootingPageProps) {
	return (
		<div className="flex flex-col min-h-screen">
			<MainAppBar />
			<div className="flex-grow flex flex-row">
				<DocsSideBar className="w-64" />
				<div className="flex-grow p-8">
					<h1 className="text-2xl font-bold mb-4">Troubleshooting Pages</h1>
					<ul className="list-disc pl-4">
						{pages.map((page) => (
							<li key={page} className="mb-2">
								<Link href={`/docs/troubleshooting/${page.replace('.tsx', '')}`} className="text-blue-500 hover:text-blue-700">
									{page.replace('.tsx', '')}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export const getStaticProps: GetStaticProps<TroubleshootingPageProps> = async () => {
	// const troubleshootingDir = path.join(process.cwd(), 'pages/docs/troubleshooting');
	const troubleshootingDir = path.join(process.cwd(), 'pages', 'docs', 'troubleshooting');

	try {
		const files = await fs.promises.readdir(troubleshootingDir);
		const pages = files.filter((file) => file.endsWith('.tsx') && file !== 'index.tsx');
		console.log('Files in troubleshooting directory:', files);
		return {
			props: {
				pages,
			},
		};
	} catch (err) {
		console.error('Error reading troubleshooting directory:', err);
		return { props: { pages: [] } };
	}
};
