import { join, basename } from 'path'
import {
    ExtensionContext,
    window,
    Uri,
    WebviewPanel,
    TextDocument,
} from 'vscode'
import { parse, RootNode } from 'svg-parser'
import { WebViewMessage } from './view/app/consts/message'
import { Text } from './consts/consts'
import { isASpriteSVG, openWebview } from './utils/fns'

export default class SvgSpritesViewer {
    public static instance = new SvgSpritesViewer()

    public static textDocument: TextDocument

    public static supportedLanguages = ['xml', 'svg']

    public onActivate(context: ExtensionContext): void {
        const activeTextEditor = window.activeTextEditor

        if (activeTextEditor?.document) {
            SvgSpritesViewer.glanceDocument(activeTextEditor.document, context)

            SvgSpritesViewer.textDocument = activeTextEditor.document
        } else {
            window.showErrorMessage(Text.notASVGDocument)
        }
    }

    public static glanceDocument(
        document: Pick<TextDocument, 'fileName' | 'getText' | 'languageId'>,
        context: ExtensionContext
    ): void {
        const { fileName, getText, languageId } = document

        if (SvgSpritesViewer.supportedLanguages.includes(languageId)) {
            const svgTree = parse(getText()) ?? null

            if (!svgTree) {
                window.showErrorMessage(Text.unableToParseSvgDocument)
            } else if (isASpriteSVG(svgTree)) {
                const { extensionPath } = context
                const panel = openWebview(basename(fileName), extensionPath)

                panel.webview.html = SvgSpritesViewer.getWebviewContent(
                    svgTree,
                    extensionPath
                )

                SvgSpritesViewerActions.attachListenerToPanel(panel, context)
            } else {
                window.showErrorMessage(Text.notASpriteSvgDocument)
            }
        } else {
            window.showErrorMessage(Text.notASVGDocument)
        }
    }

    public static getWebviewContent(
        svgTree: RootNode,
        extensionPath: string
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
            </script>
        </head>
        <body>
            <div id="root"></div>
            <script src="${reactAppUri}"></script>
        </body>
        </html>
    `
    }

    static reloadWebview(context: ExtensionContext, panel: WebviewPanel) {
        try {
            const { getText } = SvgSpritesViewer.textDocument
            const { extensionPath } = context
            const svgTree = parse(getText()) ?? null

            panel.webview.html = SvgSpritesViewer.getWebviewContent(
                svgTree,
                extensionPath
            )
        } catch (e) {
            console.error(e)
            window.showErrorMessage(Text.unableToRefreshWebview)
        }
    }
}

class SvgSpritesViewerActions {
    public static attachListenerToPanel(
        panel: WebviewPanel,
        context: ExtensionContext
    ): void {
        panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case WebViewMessage.alert:
                        SvgSpritesViewerActions.showMessage(message)
                        break
                    case WebViewMessage.reload:
                        SvgSpritesViewer.reloadWebview(context, panel)
                        break
                }
            },
            undefined,
            context.subscriptions
        )
    }

    static showMessage(message: any): void {
        switch (message.type) {
            case 'info':
                window.showInformationMessage(message.text)
                break
            case 'error':
                window.showErrorMessage(message.text)
                break
        }
    }
}
