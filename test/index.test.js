import github from '@actions/github';
import assert from 'node:assert/strict';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import sinon from 'sinon';
import { listTags } from '../src/util.js';

const branch = execSync('git branch --show-current').toString().trim();

describe('action', function () {
	before(() => {
		// https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
		dotenv.config();
	});
	after(() => {
		sinon.restore();
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
	it('workflow_dispatch', async function () {
		await assert.doesNotReject(
			github
				.getOctokit(process.env.GITHUB_TOKEN)
				.rest.actions.createWorkflowDispatch({
					owner: 'ShaMan123',
					repo: 'gha-populate-form-version',
					ref: branch,
					workflow_id: '.github/workflows/update_bug_report.yml',
				}),
		);
	});
});
