import * as vscode from 'vscode'
import { join } from 'path'
import { RootNode, ElementNode } from 'svg-parser'
import { WEB_VIEW_NAME, WEB_VIEW_TITLE } from '../consts/consts'

export const openWebview = (extensionPath: string) => {
    return vscode.window.createWebviewPanel(
        WEB_VIEW_NAME,
        WEB_VIEW_TITLE,
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
