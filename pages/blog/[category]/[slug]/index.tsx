import type { Metadata, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Post, { Article } from '../../../../components/blog/Post';
import Footer from '../../../../components/Footer';
import RudderContext from '../../../../components/RudderContext';
import { fetchAPI } from '../../../../utils/blog/fetch-api';
import { getStrapiURL } from '../../../../utils/blog/api-helpers';
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

	// Increment view count separately — keyed only to the slug so it fires exactly once per page load
	useEffect(() => {
		const slug = router.query.slug as string;
		if (!slug) return;

		getPostBySlug(slug).then((data) => {
			const article = data.data[0];
			setArticleInfo(article);

			// Increment view count — no auth header needed, endpoint is public
			const viewUrl = getStrapiURL(`/api/articles/${article.id}/view`);
			if (!viewUrl) return;
			fetch(viewUrl, { method: 'POST' })
				.then(r => r.json())
				.then(d => { if (d.viewCount !== undefined) setViewCount(d.viewCount); })
				.catch(err => console.error('[PostRoute] Failed to increment view count', err));
		}).catch((error) => { console.error(
			`[PostRoute] Unable to get post by slug ${slug}`, error);});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.slug]);

	// Track page visit separately — keyed to rudderEventMethods becoming available
	useEffect(() => {
		const slug = router.query.slug as string;
		if (!slug || !rudderEventMethods) return;
		const anonymousId = getAndSetAnonymousIdFromLocalStorage();
		rudderEventMethods.track("absent", "page-visit",
			{ type: "blog-article-page", category: router.query.category as string, slug }, anonymousId);
	}, [rudderEventMethods, router.query.slug, router.query.category]);

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