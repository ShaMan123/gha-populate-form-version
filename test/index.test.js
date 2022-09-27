import github from '@actions/github';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listTags } from '../src/util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function parseInputs(inputs) {
	return Object.keys(inputs).reduce((parsed, key) => {
		parsed[`INPUT_${key.toUpperCase()}`] =
			typeof inputs[key] !== 'string'
				? JSON.stringify(inputs[key])
				: inputs[key];
		return parsed;
	}, {});
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
	it('workflow_dispatch', async function () {
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

	describe('manual trigger', function () {
		const expected = path.resolve(__dirname, 'expected.yml');
		const template = path.resolve(__dirname, 'template.yml');
		const test = path.resolve(__dirname, 'temp.yml');
		this.beforeEach(() => {
			writeFileSync(test, readFileSync(template));
			assert.equal(
				readFileSync(test).toString(),
				readFileSync(template).toString(),
				'should prepare test',
			);
		});
		this.afterEach(() => {
			unlinkSync(test);
			assert.ok(!existsSync(test), 'should cleanup test');
		});

		it('passing tags', async function () {
			const inputs = {
				// github_token,
				form: test,
				dropdown: 'version',
				tags: ['1.2.3', '4.5.6', '7.8.9'],
				// add some junk
				order: 'desc',
				dry_run: true,
			};
			Object.assign(process.env, parseInputs(inputs));
			await import('../dist/main.cjs');
			assert.strictEqual(
				readFileSync(test).toString().replace(/\s/gm, ''),
				readFileSync(expected).toString().replace(/\s/gm, ''),
				'output should match',
			);
		});
	});
});
