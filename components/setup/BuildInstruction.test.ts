import axios from 'axios';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Session } from 'next-auth';
import BuildInstruction from './BuildInstruction';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const session = { user: { id: 'user-1' } } as Session;

describe('BuildInstruction', () => {
	beforeEach(() => {
		mockedAxios.post.mockReset();
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
});
