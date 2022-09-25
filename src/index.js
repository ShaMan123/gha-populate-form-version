import core from '@actions/core';
import cp from 'node:child_process';
import { listTags, writeYAML } from './util';

try {
	const form = core.getInput('yaml-form');
	const packageName = core.getInput('package').trim();
	const registry = core.getInput('registry').trim();
	const order = core.getInput('order').trim();
	const limitTo = core.getInput('limit-to');
	const dropdownId = core.getInput('dropdown-id').trim();
	// const commitMessage = core.getInput('commit-message');
	console.log({ form, packageName, registry, order, limitTo, dropdownId });
	const tags =
		core.getInput('tags') || listTags(registry, packageName, order, limitTo);
	core.setOutput('tags', tags);
	writeYAML(form, dropdownId, tags);
	// cp.execSync(`git add ${form}`);
	// cp.execSync(`git commit -m "${commitMessage}"`);
	// cp.execSync(`git push`);
} catch (error) {
	core.setFailed(error);
}
