import type { Metadata, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Post, { Article } from '../../../../components/blog/Post';
import Footer from '../../../../components/Footer';
import RudderContext from '../../../../components/RudderContext';
import { fetchAPI } from '../../../../utils/blog/fetch-api';
import { getAndSetAnonymousIdFromLocalStorage } from '../../../../utils/rudderstack_initialize';
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
	const [viewCount, setViewCount] = useState<number | null>(null);
	const router = useRouter();
	const { rudderEventMethods } = useContext(RudderContext);

	useEffect(() => {
		const slug = router.query.slug as string;
		if (!slug) return;

		getPostBySlug(slug).then((data) => {
			const article = data.data[0];
			setArticleInfo(article);

			// Increment view count via the Strapi custom endpoint
			const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
			fetch(`${apiUrl}/api/articles/${article.id}/view`, { method: 'POST' })
				.then(r => r.json())
				.then(d => { if (d.viewCount !== undefined) setViewCount(d.viewCount); })
				.catch(err => console.error('[PostRoute] Failed to increment view count', err));
		}).catch((error) => { console.error(
			`[PostRoute] Unable to get post by slug ${slug}`, error);});

		const anonymousId = getAndSetAnonymousIdFromLocalStorage();
		rudderEventMethods?.track("absent", "page-visit",
			{ type: "blog-article-page", category: router.query.category as string, slug }, anonymousId);
	}, [rudderEventMethods, router]);

	if (!articleInfo) return <h2>Post not found</h2>;
	return (
		<div className='overflow-hidden'>
			<Navbar transparent={true} />
			<div className='flex justify-center'>
				<div className='mx-auto max-w-3xl px-6 lg:px-0'>
					<Post article={articleInfo.attributes} viewCount={viewCount} />
				</div>
			</div>
			<Footer />
		</div>
	);
}

export async function generateStaticParams() {
	const path = `/articles`;
	try {
		const articleResponse = await fetchAPI(path, { populate: ['category'], });
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
	} catch (error) {
		console.error(`[generateStaticParams] Failed to get articles`, error);
		return null;
	}
}

export default PostRoute;