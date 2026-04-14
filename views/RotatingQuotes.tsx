import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
	text: string;
	author: string;
	title: string;
	subtitle?: string;
}

interface RotatingQuotesProps {
	quotes: Quote[];
	interval?: number;
	className?: string;
}

const RotatingQuotes: React.FC<RotatingQuotesProps> = ({
	quotes,
	interval = 10000, // Default 10 seconds
	className,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (quotes.length === 0) return;
		const timer = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
		}, interval);

		return () => clearInterval(timer);
	}, [quotes.length, interval]);

	if (quotes.length === 0) return null;

	return (
		<div className={`w-full bg-primary min-h-60 flex items-center justify-center ${className}`}>
			<div className="max-w-4xl mx-auto px-4">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
						className="text-center"
					>
						<blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-6">
							&ldquo;{quotes[currentIndex].text}&rdquo;
						</blockquote>
						<div className="text-lg text-foreground">
							<p className="font-semibold">{quotes[currentIndex].author}</p>
							<p className="text-muted-foreground">{quotes[currentIndex].title}</p>
							{quotes[currentIndex].subtitle && (
								<p className="text-muted-foreground text-sm mt-1">{quotes[currentIndex].subtitle}</p>
							)}
						</div>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};

export default RotatingQuotes;