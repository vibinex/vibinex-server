import Image from 'next/image';
import { getStrapiMedia, formatDate } from '../../utils/blog/api-helpers';
import { postRenderer } from '../../utils/blog/post-rendered';

export interface Article {
	id: number;
	attributes: {
		title: string;
		description: string;
		slug: string;
		cover: {
			data: {
				attributes: {
					url: string;
				};
			};
		};
		authorsBio: {
			data: {
				attributes: {
					name: string;
					avatar: {
						data: {
							attributes: {
								url: string;
							};
						};
					};
				};
			};
		};
		blocks: any[];
		publishedAt: string;
	};
}

const Post: React.FC<{ article: Article["attributes"] }> = ({ article }) => {
	const { title, description, publishedAt, cover, authorsBio, blocks } = article;
	const author = authorsBio.data?.attributes;
	const imageUrl = getStrapiMedia(cover.data?.attributes.url);
	const authorImgUrl = getStrapiMedia(authorsBio.data?.attributes.avatar.data.attributes.url);

	if(imageUrl === null || authorImgUrl === null) {
		console.error(`[blog/Post] imageUrl = ${imageUrl}, authorImgUrl = ${authorImgUrl}`);
	}
	// TODO - add placeholder image and/or author image
	return (
		<div className="space-y-8">
			{imageUrl && (
				<Image
					src={imageUrl}
					alt="article cover image"
					width={400}
					height={400}
					className="w-full h-96 object-cover rounded-lg"
				/>
			)}
			<div className="space-y-6">
				<h1 className="leading-tight text-5xl font-bold ">{title}</h1>
				<div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center text-primary-foreground">
					<div className="flex items-center md:space-x-2">
						{authorImgUrl && (
							<Image
								src={authorImgUrl}
								alt="article cover image"
								width={400}
								height={400}
								className="w-14 h-14 border rounded-full bg-muted border-border"
							/>
						)}
						<p className="text-md text-secondary">
							{author?.name} • {formatDate(publishedAt)}
						</p>
					</div>
				</div>
			</div>

			<div className="text-muted-foreground">
				<p>{description}</p>

				{blocks.map((section: any, index: number) => postRenderer(section, index))}
			</div>
		</div>
	);
}

export default Post;