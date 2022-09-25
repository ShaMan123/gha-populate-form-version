import core from '@actions/core';
// import github from '@actions/github';
import { listTags, writeYAML } from './util';

try {
	const form = core.getInput('yaml-form');
	const packageName = core.getInput('package');
	const registry = core.getInput('registry');
	const order = core.getInput('order');
	const limitTo = core.getInput('limit-to');
	const dropdownId = core.getInput('dropdown-id');
	const commitMessage = core.getInput('commit-message');
	const tags =
		core.getInput('tags') || listTags(registry, packageName, order, limitTo);
	core.setOutput('tags', tags);
	writeYAML(form, dropdownId, tags);
	cp.execSync(`git add ${form}`);
	cp.execSync(`git commit -m "${commitMessage}"`);
	cp.execSync(`git push`);
} catch (error) {
	core.setFailed(error.message);
}
