export const generateGitHubUser = (options: {
	login: string
	id: number
	name?: string
}) => ({
	login: options.login,
	id: options.id,
	node_id: `${options.login}-node-id`,
	avatar_url: `https://github.com/${options.login}.png`,
	gravatar_id: '',
	url: `https://api.github.com/users/${options.login}`,
	html_url: `https://github.com/${options.login}`,
	followers_url: `https://api.github.com/users/${options.login}/followers`,
	following_url: `https://api.github.com/users/${options.login}/following{/other_user}`,
	gists_url: `https://api.github.com/users/${options.login}/gists{/gist_id}`,
	starred_url: `https://api.github.com/users/${options.login}/starred{/owner}{/repo}`,
	subscriptions_url: `https://api.github.com/users/${options.login}/subscriptions`,
	organizations_url: `https://api.github.com/users/${options.login}/orgs`,
	repos_url: `https://api.github.com/users/${options.login}/repos`,
	events_url: `https://api.github.com/users/${options.login}/events{/privacy}`,
	received_events_url: `https://api.github.com/users/${options.login}/received_events`,
	type: 'User',
	site_admin: false,
})
