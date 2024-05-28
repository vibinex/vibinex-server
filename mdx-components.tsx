import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		// Allows customizing built-in components, e.g. to add styling.
		h1: ({ children }) => <h1 className='mt-4 mb-2 font-bold text-4xl'>{children}</h1>,
		h2: ({ children }) => <h2 className='mt-4 mb-1 text-3xl font-semibold'>{children}</h2>,
		h3: ({ children }) => <h3 className='mt-2 mb-1 text-2xl font-extrabold'>{children}</h3>,
		h4: ({ children }) => <h4 className='mt-2 text-xl font-semibold'>{children}</h4>,
		a: ({ href, target, children }) => <Link href={href || "#"} target={target} className='m-0 text-secondary'>{children}</Link>,
		...components,
	};
}