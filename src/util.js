import github from '@actions/github';
import { info } from '@actions/core';
import cp from 'node:child_process';
import { readFileSync } from 'node:fs';

function listNPMTags(packageName) {
	if (!packageName) {
		packageName = JSON.parse(readFileSync('package.json')).name;
	}
	info(`Fetching npm versions for ${packageName}`);
	// safeguard in case there is 1 version (the cmd returns a string)
	return []
		.concat(
			JSON.parse(
				cp.execSync(`npm view ${packageName} versions --json`).toString(),
			),
		)
		.reverse();
}
async function listGithubReleases(repoName) {
	let owner, repo;
	if (repoName.indexOf('/') > -1) {
		[owner, repo] = repoName.split('/');
	} else if (repoName) {
		owner = github.context.repo.owner;
		repo = repoName;
	} else {
		owner = github.context.repo.owner;
		repo = github.context.repo.repo;
	}
	info(`Fetching github releases for ${owner}/${repo}`);
	let page = 1;
	const tags = [];
	async function fetch() {
		const results = (
			await github
				.getOctokit(process.env.GITHUB_TOKEN)
				.rest.repos.listReleases({ owner, repo, per_page: 100, page })
		).data.map((value) => value.tag_name);
		tags.push(...results);
		page++;
		return results.length > 0 && fetch();
	}
	await fetch();
	return tags;
}
/**
 *
 * @param {string} registry
 * @param {string} packageName
 * @returns {string[]} tags in descending order
 */
export async function listTags(registry, packageName) {
	let tags = [];
	switch (registry) {
		case 'npm':
			tags = listNPMTags(packageName);
			break;
		case 'github':
			tags = listGithubReleases(packageName);
			break;
		default:
			throw new Error(`registry "${registry}" is not supported`);
	}
	return tags;
}
