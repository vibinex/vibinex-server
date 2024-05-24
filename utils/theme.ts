import { useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export const applyTheme = () => {
	const preferredTheme = localStorage.getItem('preferredTheme') || 'system';

	const root = document.documentElement;

	switch (preferredTheme) {
		case 'dark':
			root.classList.remove('light');
			root.classList.add('dark');
			break;
		case 'light':
			root.classList.remove('dark');
			root.classList.add('light');
			break;
		case 'system':
			root.classList.remove('dark');
			root.classList.remove('light');
			break;

		default:
			break;
	}
};

export const useTheme = () => {
	useEffect(() => {
		applyTheme();
	}, []);
};