import type { Metadata, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Post, { Article } from '../../../../components/blog/Post';
import Footer from '../../../../components/Footer';
import { fetchAPI } from '../../../../utils/blog/fetch-api';
import Navbar from '../../../../views/Navbar';

async function getPostBySlug(slug: string) {
	const path = `/articles`;
	const urlParamsObject = {
		filters: { slug },
		populate: {
			cover: { fields: ['url'] },
			authorsBio: { populate: '*' },
			category: { fields: ['name'] },
			blocks: { populate: '*' },
		},
	};
	const response = await fetchAPI(path, urlParamsObject);
	return response;
}

async function getMetaData(slug: string) {
	const path = `/articles`;
	const urlParamsObject = {
		filters: { slug },
		populate: { seo: { populate: '*' } },
	};
	const response = await fetchAPI(path, urlParamsObject);
	return response.data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
	const meta = await getMetaData(params.slug);
	const metadata = meta[0].attributes.seo;

	return {
		title: metadata.metaTitle,
		description: metadata.metaDescription,
	};
}

const PostRoute: NextPage = () => {
	const [articleInfo, setArticleInfo] = useState<Article>();
	const router = useRouter();
	useEffect(() => {
		async function renderPostRouteData(slug: string) {
			const data = await getPostBySlug(slug);
			setArticleInfo(data.data[0]);
		}
		renderPostRouteData(router.query.slug as string);
	},[router]);
	
	if (!articleInfo) return <h2>no post found</h2>;
	return (
	<div className='overflow-hidden'>
		<Navbar transparent={true} />
		<div className='flex justify-center'>
			<div className='mx-auto max-w-3xl px-6 lg:px-0'>
				<Post article={articleInfo.attributes} />
			</div>
		</div>
		<Footer />
	</div>
	);
}

export async function generateStaticParams() {
	const path = `/articles`;
	const articleResponse = await fetchAPI(path, {populate: ['category'],});

	return articleResponse.data.map(
		(article: {
			attributes: {
				slug: string;
				category: {
					slug: string;
				};
			};
		}) => ({ slug: article.attributes.slug, category: article.attributes.slug })
	);
}

export default PostRoute;