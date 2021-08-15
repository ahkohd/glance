import { WebviewPanel, ExtensionContext, window } from 'vscode'
import { WebViewMessage } from '../view/app/consts/message'
import SvgSpritesViewerDocumentActions from './SvgSpritesViewerDocumentActions'

export class SvgSpritesViewerActions {
    static attachListenerToPanel(
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
                        SvgSpritesViewerDocumentActions.reloadWebview(
                            message.textEditorId,
                            context,
                            panel
                        )
                        break
                    case WebViewMessage.renameSprite:
                        SvgSpritesViewerDocumentActions.renameSprite(
                            message.spriteId,
                            message.newSpriteId,
                            message.textEditorId,
                            context,
                            panel
                        )
                        break
                    case WebViewMessage.addNewSprites:
                        SvgSpritesViewerDocumentActions.addNewSprites(
                            message.svgs,
                            message.textEditorId,
                            context,
                            panel
                        )
                        break
                    case WebViewMessage.deleteSprite:
                        SvgSpritesViewerActions.confirmFirstThenRun(() => {
                            SvgSpritesViewerDocumentActions.removeSprite(
                                message.spriteId,
                                message.textEditorId,
                                context,
                                panel
                            )
                        })
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

    static confirmFirstThenRun(
        callback: () => void,
        message = 'Do you want to do this?'
    ): void {
        window
            .showInformationMessage(message, ...['Yes', 'No'])
            .then((answer) => {
                if (answer === 'Yes') {
                    callback()
                }
            })
    }
}
