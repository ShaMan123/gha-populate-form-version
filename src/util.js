import { getInput } from '@actions/core';
import github from '@actions/github';
import fs from 'fs';
import YAML from 'js-yaml';
import cp from 'node:child_process';

function listNPMTags(packageName) {
	return JSON.parse(
		cp.execSync(`npm view ${packageName} versions --json`).toString(),
	).reverse();
}
function listGithubReleases() {
	return github
		.getOctokit(process.env.GITHUB_TOKEN)
		.rest.repos.listReleases(github.context.repo);
}
export async function listTags(registry, packageName, order, limitTo) {
	let tags = [];
	switch (registry) {
		case 'npm':
			tags = listNPMTags(packageName);
			if (order === 'asc') tags.reverse();
			return tags.slice(0, limitTo);
		case 'github':
			return listGithubReleases();
		default:
			throw new Error(`registry ${registry} is not available`);
	}
}
export function writeYAML(file, dropdownId, tags) {
	const content = YAML.load(fs.readFileSync(file).toString());
	const found = content.body.find(
		(entry) => entry.id === dropdownId && entry.type === 'dropdown',
	);
	found.attributes.options = tags;
	fs.writeFileSync(file, YAML.dump(content));
}
