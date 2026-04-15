import Image from 'next/image';
import { useState } from 'react';
import { getStrapiMedia, getStrapiURL, formatDate } from '../../utils/blog/api-helpers';
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

const SubscribeForm: React.FC = () => {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;
		setStatus('loading');
		try {
			// lead-form-submission has public create permission — no auth header needed
			const url = getStrapiURL('/api/lead-form-submissions');
			if (!url) throw new Error('Strapi URL not configured');
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: { email } }),
			});
			if (res.ok) {
				setStatus('success');
				setEmail('');
			} else {
				setStatus('error');
			}
		} catch {
			setStatus('error');
		}
	};

	return (
		<div className="border border-border rounded-xl p-6 my-10 bg-primary text-center space-y-3">
			<h3 className="text-xl font-semibold text-foreground">Get future essays in your inbox</h3>
			<p className="text-muted-foreground text-sm">No noise — only when we publish something worth reading.</p>
			{status === 'success' ? (
				<p className="text-secondary font-medium">You&apos;re subscribed. Thank you!</p>
			) : (
				<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center">
					<input
						type="email"
						placeholder="your@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="border border-border rounded-md px-4 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary w-full sm:w-72"
					/>
					<button
						type="submit"
						disabled={status === 'loading'}
						className="bg-secondary text-white px-5 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
					>
						{status === 'loading' ? 'Subscribing…' : 'Subscribe'}
					</button>
				</form>
			)}
			{status === 'error' && (
				<p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
			)}
		</div>
	);
};

const Post: React.FC<{ article: Article["attributes"], viewCount?: number | null }> = ({ article, viewCount }) => {
	const { title, description, publishedAt, cover, authorsBio, blocks } = article;
	const author = authorsBio.data?.attributes;
	const imageUrl = getStrapiMedia(cover.data?.attributes.url);
	const authorImgUrl = getStrapiMedia(authorsBio.data?.attributes.avatar.data.attributes.url);

	if (imageUrl === null || authorImgUrl === null) {
		console.error(`[blog/Post] imageUrl = ${imageUrl}, authorImgUrl = ${authorImgUrl}`);
	}

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
				<h1 className="leading-tight text-5xl font-bold">{title}</h1>
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
					{viewCount !== null && viewCount !== undefined && (
						<p className="text-sm text-muted-foreground mt-2 md:mt-0">
							{viewCount.toLocaleString()} {viewCount === 1 ? 'read' : 'reads'}
						</p>
					)}
				</div>
			</div>

			<div className="text-muted-foreground">
				<p>{description}</p>
				{blocks.map((section: any, index: number) => postRenderer(section, index))}
			</div>

			<SubscribeForm />
		</div>
	);
}

export default Post;
