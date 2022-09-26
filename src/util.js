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
async function listGithubReleases() {
	return (
		await github
			.getOctokit(process.env.GITHUB_TOKEN)
			.rest.repos.listReleases(github.context.repo)
	).data.map((value) => value.tag_name);
}
export async function listTags(registry, packageName, order) {
	let tags = [];
	switch (registry) {
		case 'npm':
			tags = listNPMTags(packageName);
		case 'github':
			tags = listGithubReleases();
			break;
		default:
			throw new Error(`registry ${registry} is not available`);
	}
	return order === 'asc' ? tags.reverse() : tags;
}
export function writeYAML(file, dropdownId, tags) {
	const content = YAML.load(fs.readFileSync(file).toString());
	const found = content.body.find(
		(entry) => entry.id === dropdownId && entry.type === 'dropdown',
	);
	found.attributes.options = tags;
	fs.writeFileSync(file, YAML.dump(content));
}
