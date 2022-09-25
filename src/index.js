import { getInput } from '@actions/core';
import github from '@actions/github';
import cp from 'node:child_process';
import { listTags, writeYAML } from './util';

try {
	const form =
		getInput('yaml-form', { trimWhitespace: true }) ||
		'.github/ISSUE_TEMPLATE/bug_report.yml';
	const packageName =
		getInput('package', { trimWhitespace: true }) ||
		github.context.payload.repository.name;
	const registry = getInput('registry', { trimWhitespace: true }) || 'npm';
	const order = getInput('order', { trimWhitespace: true }) || 'desc';
	const limitTo = getInput('limit-to');
	const dropdownId =
		getInput('dropdown-id', { trimWhitespace: true }) || 'version';
	// const commitMessage = getInput('commit-message');
	console.log({ form, packageName, registry, order, limitTo, dropdownId });
	const tags =
		getInput('tags') || listTags(registry, packageName, order, limitTo);
	core.setOutput('tags', tags);
	writeYAML(form, dropdownId, tags);
	// cp.execSync(`git add ${form}`);
	// cp.execSync(`git commit -m "${commitMessage}"`);
	// cp.execSync(`git push`);
} catch (error) {
	core.setFailed(error);
}
