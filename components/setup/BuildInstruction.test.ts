import axios from 'axios';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Session } from 'next-auth';
import BuildInstruction from './BuildInstruction';

jest.mock('axios');
jest.mock('../../utils/encryptDecrypt', () => ({
	encrypt: jest.fn().mockResolvedValue('encrypted-pat'),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const session = { user: { id: 'user-1' } } as Session;

describe('BuildInstruction', () => {
	beforeEach(() => {
		mockedAxios.post.mockReset();
		process.env.NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY = 'test-key';
	});

	it('keeps the deploy button disabled after a successful build', async () => {
		mockedAxios.post.mockResolvedValueOnce({ data: { success: true, message: 'Build succeeded' } });

		render(React.createElement(BuildInstruction, {
			selectedProvider: 'github',
			selectedInstallationType: 'app',
			session,
		}));

		const deployButton = screen.getByRole('button', { name: 'Deploy on Vibinex Cloud' });
		fireEvent.click(deployButton);

		await screen.findByText('Build succeeded!');
		expect((deployButton as HTMLButtonElement).disabled).toBe(true);
	});

	it('allows retrying after the build trigger fails', async () => {
		mockedAxios.post.mockResolvedValueOnce({ data: { success: false, message: 'Build failed' } });

		render(React.createElement(BuildInstruction, {
			selectedProvider: 'github',
			selectedInstallationType: 'app',
			session,
		}));

		const deployButton = screen.getByRole('button', { name: 'Deploy on Vibinex Cloud' });
		fireEvent.click(deployButton);

		await waitFor(() => expect((deployButton as HTMLButtonElement).disabled).toBe(false));
		expect(screen.getByText('Build failed! Error: Build failed')).toBeTruthy();
	});

	it('re-enables the PAT input after a non-app build failure', async () => {
		mockedAxios.post.mockResolvedValueOnce({ data: { success: false, message: 'Invalid PAT' } });

		render(React.createElement(BuildInstruction, {
			selectedProvider: 'github',
			selectedInstallationType: 'pat',
			session,
		}));

		const patInput = screen.getByPlaceholderText('Enter your Personal Access Token') as HTMLInputElement;
		fireEvent.change(patInput, { target: { value: 'github-pat' } });
		fireEvent.click(screen.getByRole('button', { name: 'Deploy on Vibinex Cloud' }));

		await waitFor(() => expect(patInput.disabled).toBe(false));
		expect(patInput.value).toBe('github-pat');
		expect(screen.getByText('Failed to trigger build: Invalid PAT')).toBeTruthy();
	});
});
