import { ExtensionContext, commands } from 'vscode'
import SvgSpritesViewer from './core/SvgSpritesViewer'

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('glance.open', () =>
        SvgSpritesViewer.instance.onActivate(context)
    )

    context.subscriptions.push(disposable)
}

export function deactivate() {}
