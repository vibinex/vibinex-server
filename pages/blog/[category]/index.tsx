import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/blog/PageHeader";
import PostList, { Article } from "../../../components/blog/PostList";
import { fetchAPI } from "../../../utils/blog/fetch-api";


async function fetchPostsByCategory(filter: string) {
	try {
		const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
		const path = `/articles`;
		const urlParamsObject = {
			sort: { createdAt: 'desc' },
			filters: {
				category: {
					slug: filter,
				},
			},
			populate: {
				cover: { fields: ['url'] },
				category: {
					populate: '*',
				},
				authorsBio: {
					populate: '*',
				},
			},
		};
		const options = { headers: { Authorization: `Bearer ${token}` } };
		const responseData = await fetchAPI(path, urlParamsObject, options);
		return responseData;
	} catch (error) {
		console.error(error);
	}
}

const CategoryRoute: NextPage = () => {
	const [categoryName, setCategoryName] = useState<string>("");
	const [categoryDescription, setCategoryDescription] = useState<string>("");
	const [categoryData, setCategoryData] = useState<Article[]>([]);
	const router = useRouter();

	useEffect(() => {
		async function renderCategory(category: string) {
			const { data: postsByCategory } = await fetchPostsByCategory(category);
			const categoryName = postsByCategory[0]?.attributes.category.data.attributes.name;
			setCategoryData(postsByCategory);
			setCategoryName(categoryName);
			setCategoryDescription(categoryDescription);
		}
		renderCategory(router.query.category as string);
	}, [router]);

	return (
		<div>
			<PageHeader heading={categoryName} text={categoryDescription} />
			<PostList data={categoryData} />
		</div>
	);
}

export default CategoryRoute;
