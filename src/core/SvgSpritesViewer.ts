import { ExtensionContext, window, TextEditor } from 'vscode'
import SvgSpritesViewerDocumentActions from './SvgSpritesViewerDocumentActions'
import { Text } from './consts/consts'
const shortid = require('shortid')

export default class SvgSpritesViewer {
    public static instance = new SvgSpritesViewer()

    public static textEditors: Map<string, TextEditor> = new Map<
        string,
        TextEditor
    >()

    public static supportedLanguages = ['xml', 'svg']

    public onActivate(context: ExtensionContext): void {
        const activeTextEditor = window.activeTextEditor

        if (activeTextEditor?.document) {
            const documentId = shortid.generate()

            SvgSpritesViewerDocumentActions.glanceDocument(
                documentId,
                activeTextEditor.document,
                context
            )
            SvgSpritesViewer.textEditors.set(documentId, activeTextEditor)
        } else {
            window.showErrorMessage(Text.notASVGDocument)
        }
    }
}
