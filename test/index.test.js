import github from '@actions/github';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
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

function assertOutputs(inputs, expectedTags) {
	const stdout = execSync('node dist/main.cjs', {
		env: {
			...process.env,
			...parseInputs(inputs),
			GITHUB_REPOSITORY: 'ShaMan123/gha-populate-form-version',
		},
	});

	let output;
	if (fs.existsSync(process.env.GITHUB_OUTPUT)) {
		const ghaEnvFile = fs.readFileSync(process.env.GITHUB_OUTPUT).toString();
		output = Object.fromEntries(
			ghaEnvFile.split(/^ghadelimiter_.+\n/gm).map((entry) => {
				const [header, body] = entry.split('\n');
				return [header.split('<<')[0], body];
			}),
		);
	} else {
		output = stdout
			.toString()
			.trim()
			.split('\n')
			.reduce((outputs, value) => {
				const directive = '::set-output name=';
				if (value.includes(directive)) {
					const [key, val] = value.trim().replace(directive, '').split('::');
					outputs[key] = val;
				}
				return outputs;
			}, {});
	}

	const { latest, tags } = output;
	assert.deepEqual(JSON.parse(tags), expectedTags, 'should set outputs.tags');
	assert.ok(latest, 'should set outputs.latest');
}

describe('action', function () {
	this.timeout(10000);
	this.beforeAll(() => {
		// https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
		dotenv.config();
	});
	it('fetches', async function () {
		this.timeout(20000);
		assert.ok(
			(await listTags('npm', '  fabric ')).length > 0,
			'should fetch tags from npm',
		);
		assert.ok(
			(await listTags('github', 'ShaMan123/react-native-math-view')).length > 0,
			'should fetch tags from github by user and repo',
		);
		assert.ok(
			(await listTags('github', 'nodejs/node')).length > 300,
			'should paginate and fetch all results',
		);
		assert.deepEqual(
			(await listTags('github', 'ShaMan123/gha-populate-form-version'))
				.reverse()
				.slice(0, 10),
			[
				'v0.1.0',
				'v0.1.1',
				'v0.1.2',
				'v0.1.11',
				'v0.1.12',
				'v0.1.13',
				'v0.1.14',
				'v0.1.15',
				'v0.1.16',
				'v0.1.17',
			],
			'tags should match',
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
	it('github releases', async function () {
		const inputs = {
			dropdown: 'version',
			package: 'gha-populate-form-version',
			registry: 'github',
			order: 'asc',
			limit_to: 5,
		};
		assertOutputs(inputs, ['v0.1.0', 'v0.1.1', 'v0.1.2', 'v0.1.11', 'v0.1.12']);
	});
	it('github releases different user', async function () {
		const inputs = {
			dropdown: 'version',
			package: 'fabricjs/fabric.js',
			registry: 'github',
			order: 'asc',
			limit_to: 5,
		};
		assertOutputs(inputs, ['v1.4.0', 'v1.4.8', 'v1.4.9', 'v1.4.10', 'v1.4.11']);
	});
	it('semver', async function () {
		const inputs = {
			dropdown: 'version',
			package: 'gha-populate-form-version',
			registry: 'github',
			semver: 'v0.1.x',
		};
		assertOutputs(
			inputs,
			[
				'v0.1.0',
				'v0.1.1',
				'v0.1.2',
				'v0.1.11',
				'v0.1.12',
				'v0.1.13',
				'v0.1.14',
				'v0.1.15',
				'v0.1.16',
				'v0.1.17',
				'v0.1.18',
				'v0.1.19',
				'v0.1.21',
			].reverse(),
		);
	});
	it('npm package', async function () {
		const inputs = {
			dropdown: 'version',
			package: 'fabric',
			registry: 'npm',
			order: 'asc',
			limit_to: 5,
		};
		assertOutputs(inputs, ['0.5.2', '0.5.3', '0.5.5', '0.5.6', '0.5.7']);
	});
});
