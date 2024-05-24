import { useEffect } from 'react';

export type Theme = 'dark' | 'light';
const DEFAULT_THEME: Theme = 'light';

export const getPreferredTheme = () : Theme => {
	const preferredTheme = localStorage.getItem('preferredTheme') || 'system';
	if (preferredTheme !== 'system') {
		// check if the preferredTheme is a valid value
		if (preferredTheme !== 'dark' && preferredTheme !== 'light') {
			console.error('[getPreferredTheme] Invalid theme: ' + preferredTheme);
			return DEFAULT_THEME;
		}
		return preferredTheme as Theme;
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
			console.error('[applyTheme] Invalid theme: ' + preferredTheme);
			break;
	}
};

export const useTheme = () => {
	useEffect(() => {
		applyTheme();
	}, []);
};