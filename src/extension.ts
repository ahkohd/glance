import { ExtensionContext, commands } from "vscode";
import SVGIconsViewer from "./SVGIconsViewer";

// @TODO: Add action icon to the editor tabs bar, when
// clicked it will open the SVG sprites view

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand("svgspritesviewer.open", () =>
    SVGIconsViewer.instance.onActivate(context)
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
