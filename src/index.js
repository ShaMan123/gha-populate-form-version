import { getInput, setFailed, setOutput } from '@actions/core';
import semver from 'semver';
import { listTags, writeYAML } from './util';

async function run() {
	try {
		const form = getInput('form', { trimWhitespace: true, required: true });
		const packageName = getInput('package', {
			trimWhitespace: true,
			required: true,
		});
		const registry = getInput('registry', {
			trimWhitespace: true,
			required: true,
		});
		const order = getInput('order', { trimWhitespace: true, required: true });
		const limitTo =
			Math.abs(Number(getInput('limit_to', { trimWhitespace: true }))) ||
			undefined;
		const dropdownId = getInput('dropdown', {
			trimWhitespace: true,
			required: true,
		});
		const semverRange = getInput('semver', {
			trimWhitespace: true,
		});
		const tags =
			getInput('tags', { trimWhitespace: true }) ||
			(await listTags(registry, packageName, order))
				.slice(0, limitTo)
				.filter((tag) => semver.satisfies(semver.clean(tag), semverRange));
		setOutput('tags', tags);
		writeYAML(form, dropdownId, tags);
	} catch (error) {
		console.log(error);
		setFailed(error);
	}
}

run();
