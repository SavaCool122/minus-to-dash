import fs from 'node:fs'
import path from 'node:path'
import {remark} from 'remark'
import plugin from './minusToDash.js'
import {unified} from 'unified'
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'

const PROJECT_PATH = './src'

const findRelevantFiles = () => {
	const relevantFiles = new Set();
	const pendingPath = [path.resolve(PROJECT_PATH)];
	
	while (pendingPath.length > 0) {
		const currentPath = pendingPath.shift();
		fs.readdirSync(currentPath, { withFileTypes: true }).forEach((entry) => {
			
			if (entry.isDirectory() && entry.name === 'node_modules') {
			
			} else if (entry.isFile() && entry.name.endsWith(".md")) {
				relevantFiles.add(path.resolve(currentPath, entry.name));
			} else if (entry.isDirectory()) {
				pendingPath.push(path.resolve(currentPath, entry.name));
			}
		});
	}
	
	return Array.from(relevantFiles);
};

const processMdFiles = (files) => {
	files.forEach(async filePath => {
		const doc = fs.readFileSync(filePath, 'utf8')
			const file = await unified()
				.use(remarkParse)
				.use(plugin)
				.use(remarkStringify, {
					bullet: '-',
					fence: '~',
					fences: true,
					incrementListMarker: false
				})
				.process(doc)
			
		fs.writeFileSync(filePath, file.value)
	})
}

const relevantFiles = findRelevantFiles()
processMdFiles(relevantFiles)