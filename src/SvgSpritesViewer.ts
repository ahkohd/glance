import { join, basename } from 'path'
import { ExtensionContext, window, Uri, WebviewPanel } from 'vscode'
import { parse, RootNode } from 'svg-parser'
import { Text, WebViewMessage } from './consts/consts'
import { isASpriteSVG, openWebview } from './utils/fns'

export default class SvgSpritesViewer {
    public static instance = new SvgSpritesViewer()

    public onActivate(context: ExtensionContext): void {
        const documentFileName = basename(
            window.activeTextEditor?.document.fileName ?? ''
        )
        const documentSourceCode = window.activeTextEditor?.document.getText()
        const documentLanguage = window.activeTextEditor?.document.languageId

        if (documentLanguage === 'svg') {
            const svgTree = parse(documentSourceCode!) ?? null

            if (!svgTree) {
                window.showErrorMessage(Text.unableToParseSvgDocument)
            } else if (isASpriteSVG(svgTree)) {
                const { extensionPath } = context
                const panel = openWebview(documentFileName, extensionPath)

                panel.webview.html = this.getWebviewContent(
                    svgTree,
                    extensionPath
                )
                this.attachMessageListner(panel, context)
            } else {
                window.showErrorMessage(Text.notASpriteSvgDocument)
            }
        } else {
            window.showErrorMessage(Text.notASVGDocument)
        }
    }

    private getWebviewContent(
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
            <title>Config View</title>
            <meta http-equiv="Content-Security-Policy"
                content="default-src 'none';
                        img-src https:;
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

    private attachMessageListner(
        panel: WebviewPanel,
        context: ExtensionContext
    ) {
        panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case WebViewMessage.alert:
                        SvgSpritesViewerActions.showMessage(message)
                        return
                }
            },
            undefined,
            context.subscriptions
        )
    }
}

class SvgSpritesViewerActions {
    static showMessage(message: any) {
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
