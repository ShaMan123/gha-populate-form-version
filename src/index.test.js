import { listTags } from './util.js';
import semver from 'semver';

console.log(listTags('npm', '  fabric ', 'desc', 10));
console.log(semver.satisfies('1.2.3', ''));
