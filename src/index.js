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
			Math.max(Number(getInput('limit_to', { trimWhitespace: true })), 0) ||
			undefined;
		const dropdownId = getInput('dropdown', {
			trimWhitespace: true,
			required: true,
		});
		const semverRange = getInput('semver', {
			trimWhitespace: true,
		});
		let tags;
		const tagsInput = getInput('tags', { trimWhitespace: true });
		if (tagsInput) {
			try {
				tags = JSON.parse(tagsInput);
			} catch (error) {
				tags = tagsInput.split(',').map((value) => value.trim());
			}
		} else {
			const list = await listTags(registry, packageName);
			const latest = list[0];
			if (order === 'asc') {
				list.reverse();
			}
			tags = list
				.slice(0, limitTo)
				.filter((tag) => semver.satisfies(semver.clean(tag), semverRange));

			setOutput('latest', latest);
			setOutput('tags', tags);
		}
		writeYAML(form, dropdownId, tags);
	} catch (error) {
		setFailed(error);
	}
}

run();
