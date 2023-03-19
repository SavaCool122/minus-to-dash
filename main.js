import fs from "node:fs"
import path from "node:path"
import { unified } from "unified"
import remarkStringify from "remark-stringify"
import remarkParse from "remark-parse"

const PROJECT_PATH = "./example"

const plugin = () => tree => {
	const pendingNodes = [...tree.children]
	while (pendingNodes.length) {
		const currentNode = pendingNodes.shift()
		if (currentNode?.children?.length > 0) {
			pendingNodes.push(...currentNode.children)
		}
		if (currentNode.type === "text") {
			currentNode.value = currentNode.value.replace(" - ", " — ")
		}
	}
}

const findRelevantFiles = () => {
	const relevantFiles = new Set()
	const pendingPath = [path.resolve(PROJECT_PATH)]

	while (pendingPath.length > 0) {
		const currentPath = pendingPath.shift()
		fs.readdirSync(currentPath, { withFileTypes: true }).forEach(entry => {
			if (entry.isDirectory() && entry.name === "node_modules") {
			} else if (entry.isFile() && entry.name.endsWith(".md")) {
				relevantFiles.add(path.resolve(currentPath, entry.name))
			} else if (entry.isDirectory()) {
				pendingPath.push(path.resolve(currentPath, entry.name))
			}
		})
	}

	return Array.from(relevantFiles)
}

const processMdFiles = files => {
	files.forEach(async filePath => {
		const doc = fs.readFileSync(filePath, "utf8")
		const ff = await unified()
			.use(remarkParse)
			.use(plugin)
			.use(remarkStringify, {
				bullet: "-",
				fence: "~",
				fences: true,
				incrementListMarker: false,
				listItemIndent: 'one',
			})
			.process(doc)

		//https://github.com/executablebooks/mdformat/issues/112
		ff.value = ff.value.replaceAll("\\[", "[")
		fs.writeFileSync(filePath, ff.value)
	})

	console.log(`${files.length} files processed`)
}

const relevantFiles = findRelevantFiles()
processMdFiles(relevantFiles)
