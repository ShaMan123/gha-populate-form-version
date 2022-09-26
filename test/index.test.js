import assert from 'assert';
import * as dotenv from 'dotenv';
import { listTags } from '../src/util.js';

describe('action', function () {
	before(() => {
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
});
