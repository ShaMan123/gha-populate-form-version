import { listTags } from './util.js';
import semver from 'semver';

// console.log(listTags('npm', '  fabric ', 'desc', 10).length > 0);
console.log(semver.satisfies('1.2.3', ''));
console.log(semver.satisfies('0.1.19', '>=0.1.20'));
