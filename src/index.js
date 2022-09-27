import { getInput, setFailed, setOutput } from '@actions/core';
import semver from 'semver';
import { listTags } from './util';

async function run() {
	try {
		const packageName = getInput('package', {
			trimWhitespace: true,
		});
		const registry = getInput('registry', {
			trimWhitespace: true,
		});
		const order = getInput('order', { trimWhitespace: true });
		const limitTo =
			Math.max(Number(getInput('limit_to', { trimWhitespace: true })), 0) ||
			undefined;
		const semverRange = getInput('semver', {
			trimWhitespace: true,
		});
		const list = await listTags(registry, packageName);
		const latest = list[0];
		if (order === 'asc') {
			list.reverse();
		}
		const tags = list
			.slice(0, limitTo)
			.filter((tag) => semver.satisfies(semver.clean(tag), semverRange));
		setOutput('latest', latest);
		setOutput('tags', tags);
	} catch (error) {
		console.error(error);
		setFailed(error);
	}
}

run();
