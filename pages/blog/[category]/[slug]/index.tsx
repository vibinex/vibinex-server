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
	const router = useRouter();
	const { rudderEventMethods } = useContext(RudderContext);
	useEffect(() => {
		// TODO: check that router.query.slug is a string
		const slug = router.query.slug as string;
		getPostBySlug(slug).then((data) => {
			setArticleInfo(data.data[0]);
		}).catch((error) => { console.error(
			`[PostRoute] Unable to get post by slug ${slug}`, error);});
		const anonymousId = getAndSetAnonymousIdFromLocalStorage();
		rudderEventMethods?.track("absent", "page-visit",
			{ type: "blog-main-page", slug: slug}, anonymousId);
	}, [rudderEventMethods, router]);

	if (!articleInfo) return <h2>Post not found</h2>;
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