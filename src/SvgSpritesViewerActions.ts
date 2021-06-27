import SvgSpritesViewer from './SvgSpritesViewer'
import { WebviewPanel, ExtensionContext, window } from 'vscode'
import { WebViewMessage } from './view/app/consts/message'

export class SvgSpritesViewerActions {
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
                        SvgSpritesViewer.reloadWebview(
                            message.textDocumentId,
                            context,
                            panel
                        )
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
