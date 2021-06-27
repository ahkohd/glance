import { ExtensionContext, window, TextDocument } from 'vscode'
import SvgSpritesViewerDocumentActions from './SvgSpritesViewerDocumentActions'
import { Text } from './consts/consts'
const shortid = require('shortid')

export default class SvgSpritesViewer {
    public static instance = new SvgSpritesViewer()

    public static textDocuments: Map<string, TextDocument> = new Map<
        string,
        TextDocument
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
            SvgSpritesViewer.textDocuments.set(
                documentId,
                activeTextEditor.document
            )
        } else {
            window.showErrorMessage(Text.notASVGDocument)
        }
    }
}
