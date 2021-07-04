import * as vscode from 'vscode'
import { join } from 'path'
import { RootNode, ElementNode } from 'svg-parser'
import { WEB_VIEW_NAME, WEB_VIEW_TITLE } from '../consts/consts'
import { nodeToSvgText } from '../../view/app/utils/fns'
import shortid = require('shortid')

export const openWebview = (
    documentFileName: string,
    extensionPath: string
) => {
    return vscode.window.createWebviewPanel(
        WEB_VIEW_NAME,
        WEB_VIEW_TITLE.replace('SVG', documentFileName),
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(join(extensionPath, 'out'))],
        }
    )
}

export const isASpriteSVG = (svgTree: RootNode) => {
    const firstChildTag =
        ((svgTree?.children[0] as ElementNode)?.children[0] as ElementNode) ??
        null

    return (
        firstChildTag &&
        firstChildTag.tagName === 'symbol' &&
        firstChildTag?.properties?.id
    )
}

export const nodeToSymbolText = (node: ElementNode, name?: string): string => {
    const symbolId = name
        ? name
        : node?.properties?.id ?? strToValidVariableName(shortid.generate())

    if (node.type === 'element') {
        return `<symbol id="${symbolId}" stroke="currentColor" ${Object.entries(
            node.properties as any
        )
            .filter(
                (entry) =>
                    !['width', 'height', 'id', 'stroke', 'xmlns'].includes(
                        entry[0]
                    )
            )
            .map((entry) => `${entry[0]}="${entry[1]}"`)
            .join(' ')}  xmlns="http://www.w3.org/2000/svg">${node.children
            .map((children) => nodeToSvgText(children as ElementNode))
            .join('')}</symbol>`
    } else {
        return ''
    }
}

export const strToValidVariableName = (str: string, replaceHyphen = false) => {
    let convertedStr = str.trim()

    // remove all special characters
    convertedStr = convertedStr.replace(/[^0-9a-zA-Z -]+/g, '')

    // replace whitespace to underscore
    convertedStr = convertedStr.replace(/\s+/g, '_')

    if (replaceHyphen) {
        convertedStr = convertedStr.replace(/\-+/g, '_')
    }

    // check if string starts with a numeric character
    if (/^\d+$/.test(convertedStr.charAt(0))) {
        // remove the starting numeric character
        convertedStr = convertedStr.slice(1)
    }

    return convertedStr
}
