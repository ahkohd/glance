import { ExtensionContext, window, Uri } from 'vscode'
import { parse, RootNode } from 'svg-parser'
import { Text } from 'consts/consts'
import { isASpriteSVG, openWebview } from 'utils/fns'
import { join } from 'path'

export default class SvgSpritesViewer {
    public static instance = new SvgSpritesViewer()

    public onActivate(context: ExtensionContext): void {
        const documentSourceCode = window.activeTextEditor?.document.getText()
        const svgTree = parse(documentSourceCode!) ?? null

        if (!svgTree) {
            window.showErrorMessage(Text.unableToParseSvgDocument)
            return
        }

        if (isASpriteSVG(svgTree)) {
            const { extensionPath } = context
            const viewer = openWebview(extensionPath)

            viewer.webview.html = this.getWebviewContent(svgTree, extensionPath)
        } else {
            window.showErrorMessage(Text.notASpriteSvgDocument)
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
}
