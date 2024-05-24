import { useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'system';
const DEFAULT_THEME: Theme = 'light';

export const getPreferredTheme = () => {
	const preferredTheme = localStorage.getItem('preferredTheme') || 'system';
	if (preferredTheme !== 'system') {
		return preferredTheme;
	}
	
	if (window.matchMedia) {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			return 'light';
		}
	}
	
	// If the media query is not supported or the user has no preference, return default theme
	return DEFAULT_THEME;
}

export const applyTheme = () => {
	const preferredTheme = getPreferredTheme();
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
		default:
			console.error('Invalid theme: ' + preferredTheme);
			break;
	}
};

export const useTheme = () => {
	useEffect(() => {
		applyTheme();
	}, []);
};