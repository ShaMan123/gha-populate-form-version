import github from '@actions/github';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import assert from 'node:assert/strict';
import { listTags } from '../src/util.js';

function getBranch() {
	if (!process.env.CI) {
		return execSync('git branch --show-current').toString().trim();
	}
	switch (process.env.GITHUB_EVENT_NAME) {
		case 'pull_request':
			return process.env.GITHUB_HEAD_REF;
		case 'release':
			return 'main';
		default:
			return process.env.GITHUB_REF;
	}
}

describe('action', function () {
	this.timeout(5000);
	this.beforeAll(() => {
		// https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
		dotenv.config();
	});
	it('npm by package', async function () {
		assert.ok(
			(await listTags('npm', '  fabric ')).length > 0,
			'should fetch tags from npm',
		);
	});
	it('github by user and repo', async function () {
		assert.ok(
			(await listTags('github', 'ShaMan123/react-native-math-view')).length > 0,
			'should fetch tags from github by user and repo',
		);
	});
	it.skip('workflow_dispatch', async function () {
		await assert.doesNotReject(
			github
				.getOctokit(process.env.GITHUB_TOKEN)
				.rest.actions.createWorkflowDispatch({
					owner: 'ShaMan123',
					repo: 'gha-populate-form-version',
					ref: getBranch(),
					workflow_id: '.github/workflows/update_bug_report.yml',
				}),
		);
	});
});
