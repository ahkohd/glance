import * as vscode from "vscode";
import { onActivate } from "./lib";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("svgicon.open", () =>
    onActivate(context)
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
