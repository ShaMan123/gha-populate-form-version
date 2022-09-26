import semver from 'semver';
import { listTags } from './util.js';
import * as dotenv from 'dotenv';
// https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
dotenv.config();

async function test() {
	console.log(await listTags('npm', '  fabric ', 'desc', 10));
	console.log(
		await listTags('github', 'ShaMan123/react-native-math-view', 'desc', 10),
	);
	console.log(semver.satisfies('1.2.3', ''));
	console.log(semver.satisfies('0.1.19', '>=0.1.20'));
}

test();
