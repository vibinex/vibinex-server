import type { Metadata, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Post from '../../../../components/blog/Post';
import { Article } from '../../../../components/blog/Post';
import Footer from '../../../../components/Footer';
import { fetchAPI } from '../../../../utils/blog/fetch-api';
import Navbar from '../../../../views/Navbar';

async function getPostBySlug(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
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
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response;
}

async function getMetaData(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        filters: { slug },
        populate: { seo: { populate: '*' } },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
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
    <div>
        <Navbar transparent={true} />
        <Post article={articleInfo.attributes} />
        <Footer />
    </div>
    );
}

export async function generateStaticParams() {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const articleResponse = await fetchAPI(
        path,
        {
            populate: ['category'],
        },
        options
    );

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