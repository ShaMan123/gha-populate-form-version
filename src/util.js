import fs from 'fs';
import YAML from 'js-yaml';
import cp from 'node:child_process';

function listNPMTags(packageName) {
	return JSON.parse(
		cp.execSync(`npm view ${packageName} versions --json`).toString(),
	).reverse();
}
export function listTags(registry, packageName, order, limitTo) {
	console.log(registry, packageName, order, limitTo);
	registry = 'npm';
	let tags = [];
	switch (registry) {
		case 'npm':
			tags = listNPMTags(packageName);
			if (order === 'asc') tags.reverse();
			return tags.slice(0, limitTo);
		default:
			throw new Error(`registry ${registry} is not available`);
	}
}
export function writeYAML(file, dropdownId, tags) {
	const content = YAML.load(fs.readFileSync(file).toString());
	const found = content.body.find(
		(entry) => entry.id === dropdownId && entry.type === 'dropdown',
	);
	found.attributes.options = tags;
	fs.writeFileSync(file, YAML.dump(content));
}
