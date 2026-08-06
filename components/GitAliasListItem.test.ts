import axios from 'axios';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import GitAliasListItem, { withPendingHandle } from './GitAliasListItem';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('withPendingHandle', () => {
	it('includes a typed handle that has not yet been converted to a chip', () => {
		expect(withPendingHandle(['existing-user'], ' new-user ')).toEqual([
			'existing-user',
			'new-user',
		]);
	});

	it('does not add blank or duplicate pending handles', () => {
		expect(withPendingHandle(['existing-user', ''], 'existing-user')).toEqual(['existing-user']);
		expect(withPendingHandle(['existing-user', ''], '   ')).toEqual(['existing-user']);
	});
});

describe('GitAliasListItem', () => {
	it('submits a pending typed handle only when Save is clicked', async () => {
		mockedAxios.post.mockResolvedValueOnce({ status: 200 });
		const setProviderMap = jest.fn();
		const providerMap = {
			alias: 'Developer',
			handleMaps: [{ provider: 'github' as const, handles: ['existing-user'] }],
		};

		render(React.createElement(GitAliasListItem, { providerMap, setProviderMap }));

		fireEvent.click(screen.getByTitle('Edit'));
		const input = screen.getByPlaceholderText('github handles');
		fireEvent.change(input, { target: { value: ' new-user ' } });

		fireEvent.click(input.parentElement as HTMLElement);
		expect(mockedAxios.post).not.toHaveBeenCalled();

		fireEvent.click(screen.getByTitle('Save'));

		await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith(
			'/api/alias',
			{
				aliasHandleMap: {
					alias: 'Developer',
					handleMaps: [{ provider: 'github', handles: ['existing-user', 'new-user'] }],
				},
			},
			{ headers: { 'Content-Type': 'application/json' } },
		));
		expect(setProviderMap).toHaveBeenCalledWith({
			alias: 'Developer',
			handleMaps: [{ provider: 'github', handles: ['existing-user', 'new-user'] }],
		});
	});
});
