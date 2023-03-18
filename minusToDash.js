export default () => tree => {
	const pendingNodes = [...tree.children]
	while (pendingNodes.length) {
		const currentNode = pendingNodes.shift()
		if (currentNode?.children?.length > 0) {
			pendingNodes.push(...currentNode.children)
		}
		if (currentNode.type === 'text') {
			currentNode.value = currentNode.value.replace(' - ', ' — ')
		}
	}
}
