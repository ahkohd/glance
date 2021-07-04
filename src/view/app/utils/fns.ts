import { ElementNode } from 'svg-parser'

export const nodeToSvgText = (node: ElementNode): string => {
    if (node.type === 'element') {
        return `<${node.tagName} ${Object.entries(node.properties as any)
            .map((entry) => `${entry[0]}="${entry[1]}"`)
            .join(' ')}>${node.children
            .map((children) => nodeToSvgText(children as ElementNode))
            .join('')}</${node.tagName}>`
    }

    return ''
}
