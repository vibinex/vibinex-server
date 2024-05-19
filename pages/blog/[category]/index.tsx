import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import PageHeader from "../../../components/blog/PageHeader";
import PostList, { Article } from "../../../components/blog/PostList";
import RudderContext from "../../../components/RudderContext";
import { fetchAPI } from "../../../utils/blog/fetch-api";
import { getAndSetAnonymousIdFromLocalStorage } from "../../../utils/rudderstack_initialize";


async function fetchPostsByCategory(filter: string) {
	try {
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
		const responseData = await fetchAPI(path, urlParamsObject);
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
	const { rudderEventMethods } = useContext(RudderContext);

	useEffect(() => {
		async function renderCategory(category: string) {
			const { data: postsByCategory } = await fetchPostsByCategory(category);
			const catName = postsByCategory[0]?.attributes.category.data.attributes.name;
			const catDesc = postsByCategory[0]?.attributes.category.data.attributes.description;
			setCategoryData(postsByCategory);
			setCategoryName(catName);
			setCategoryDescription(catDesc);
		}
		const category = router.query.category as string 
		renderCategory(category);
		rudderEventMethods?.page("page-visit", "blog-category-page", { category: category });
	}, [rudderEventMethods, router]);

	return (
		<div>
			<PageHeader heading={categoryName} text={categoryDescription} />
			<PostList data={categoryData} />
		</div>
	);
}

export default CategoryRoute;
