import core from '@actions/core';
import github from '@actions/github';
import cp from 'node:child_process';
import { listTags, writeYAML } from './util';

try {
	const form =
		core.getInput('yaml-form') || '.github/ISSUE_TEMPLATE/bug_report.yml';
	const packageName =
		core.getInput('package').trim() || github.context.payload.repository.name;
	const registry = core.getInput('registry').trim() || 'npm';
	const order = core.getInput('order').trim() || 'desc';
	const limitTo = core.getInput('limit-to');
	const dropdownId = core.getInput('dropdown-id').trim() || 'version';
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
