import {
    Uri,
    TextDocument,
    ExtensionContext,
    WebviewPanel,
    window,
    workspace,
} from 'vscode'
import { join, basename, parse as parsepath } from 'path'
import { RootNode, parse, ElementNode } from 'svg-parser'
const xmlFormatter = require('xml-formatter')
import { Text } from './consts/consts'
import SvgSpritesViewer from './SvgSpritesViewer'
import { SvgSpritesViewerActions } from './SvgSpritesViewerActions'
import {
    isASpriteSVG,
    nodeToSymbolText,
    openWebview,
    strToValidVariableName,
} from './utils/fns'

export default class SvgSpritesViewerDocumentActions {
    static getWebviewContent(
        svgTree: RootNode,
        extensionPath: string,
        textEditorId: string
    ): string {
        const reactAppPathOnDisk = Uri.file(
            join(extensionPath, 'out', 'svgSpriteViewer.js')
        )

        const reactAppUri = reactAppPathOnDisk.with({
            scheme: 'vscode-resource',
        })

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Glance</title>
            <meta http-equiv="Content-Security-Policy"
                content="
                        script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                        style-src vscode-resource: 'unsafe-inline';">
    
            <script>
                window.initialData = ${JSON.stringify(svgTree)};
                window.textEditorId = "${textEditorId}";
            </script>
        </head>
        <body>
            <div id="root"></div>
            <script src="${reactAppUri}"></script>
        </body>
        </html>
    `
    }

    static glanceDocument(
        textEditorId: string,
        textDocument: TextDocument,
        context: ExtensionContext
    ): void {
        const { fileName, getText, languageId } = textDocument

        if (SvgSpritesViewer.supportedLanguages.includes(languageId)) {
            const svgTree = parse(getText()) ?? null

            if (!svgTree) {
                window.showErrorMessage(Text.unableToParseSvgDocument)
            } else if (isASpriteSVG(svgTree)) {
                const { extensionPath } = context
                const panel = openWebview(basename(fileName), extensionPath)

                panel.webview.html =
                    SvgSpritesViewerDocumentActions.getWebviewContent(
                        svgTree,
                        extensionPath,
                        textEditorId
                    )

                SvgSpritesViewerActions.attachListenerToPanel(panel, context)

                panel.onDidDispose(() =>
                    SvgSpritesViewer.textEditors.delete(textEditorId)
                )
            } else {
                window.showErrorMessage(Text.notASpriteSvgDocument)
            }
        } else {
            window.showErrorMessage(Text.notASVGDocument)
        }
    }

    static async reloadWebview(
        textEditorId: string,
        context: ExtensionContext,
        panel: WebviewPanel,
        readFromUri: boolean = false
    ) {
        try {
            const { getText, uri } =
                SvgSpritesViewer.textEditors.get(textEditorId)!.document
            const { extensionPath } = context

            const text = !readFromUri
                ? getText()
                : ((await workspace.fs.readFile(uri)) ?? '').toString()
            const svgTree = parse(text) ?? null

            panel.webview.html =
                SvgSpritesViewerDocumentActions.getWebviewContent(
                    svgTree,
                    extensionPath,
                    textEditorId
                )
        } catch (e) {
            window.showErrorMessage(Text.unableToRefreshWebview)
        }
    }

    static addNewSprites(
        svgs: Array<{ svg: string; name: string }>,
        textEditorId: string,
        context: ExtensionContext,
        panel: WebviewPanel
    ): void {
        const symbols: string[] = []

        // parse and extract symbols from svgs
        svgs.forEach(({ svg, name }) => {
            const svgTree = parse(svg) ?? null

            if (!svgTree) {
                window.showErrorMessage(
                    Text.unableToParseSvgDocumentSpecific.replace('{}', name)
                )
            } else {
                if (isASpriteSVG(svgTree)) {
                    ;(svgTree.children[0] as ElementNode).children.forEach(
                        (child) => {
                            symbols.push(nodeToSymbolText(child as ElementNode))
                        }
                    )
                } else {
                    symbols.push(
                        nodeToSymbolText(
                            svgTree.children[0] as ElementNode,
                            strToValidVariableName(parsepath(name).name)
                        )
                    )
                }
            }
        })

        if (symbols.length > 0) {
            const newSprites = symbols.join('')

            const {
                document: { getText, uri },
            } = SvgSpritesViewer.textEditors.get(textEditorId)!

            const sprites = getText()
            const lastIndexOfClosingSvgTag = sprites.lastIndexOf('</svg>')
            const updatedSprites = xmlFormatter(
                `${sprites.slice(
                    0,
                    lastIndexOfClosingSvgTag
                )}${newSprites}${sprites.slice(lastIndexOfClosingSvgTag)}`
            )

            const writeData = Buffer.from(updatedSprites, 'utf8')

            workspace.fs.writeFile(uri, writeData).then(
                () => {
                    SvgSpritesViewerDocumentActions.reloadWebview(
                        textEditorId,
                        context,
                        panel,
                        true
                    )

                    window.showInformationMessage(
                        Text.newSpritesAdd.replace(
                            '{}',
                            `${symbols.length.toString()} new sprite${
                                symbols.length > 1 ? 's' : ''
                            }`
                        )
                    )
                },
                () => {
                    window.showErrorMessage(Text.unableToAddNewSprite)
                }
            )
        }
    }
}
