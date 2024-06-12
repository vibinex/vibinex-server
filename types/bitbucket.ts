export interface BitbucketProfile {
	display_name: string;
	links: BitbucketProfileLinks;
	created_on: Date;
	type: string;
	uuid: string;
	has_2fa_enabled: null;
	username: string;
	is_staff: boolean;
	account_id: string;
	nickname: string;
	account_status: string;
	location: null;
}

export interface BitbucketDBRepo {
	repo_name: string;
	repo_owner: string;
	repo_provider: string;
	clone_ssh_url: string;
	project: {
		name: string;
		type: string;
	};
	is_private: boolean;
	uuid: string;
	workspace: string;
}

export interface BitbucketProfileLinks {
	self: BitbucketAvatarResource;
	avatar: BitbucketAvatarResource;
	repositories: BitbucketAvatarResource;
	snippets: BitbucketAvatarResource;
	html: BitbucketAvatarResource;
	hooks: BitbucketAvatarResource;
}

export interface BitbucketAvatarResource {
	href: string;
}

export interface BitbucketEmailsResponse {
	values: BitbucketEmailResource[];
	pagelen: number;
	size: number;
	page: number;
}

export interface BitbucketEmailResource {
	type: string;
	links: null[];
	email: string;
	is_primary: boolean;
	is_confirmed: boolean;
}