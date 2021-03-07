import * as vscode from "vscode";
import { parse, RootNode, ElementNode } from "svg-parser";
import { Text, WEB_VIEW_NAME, WEB_VIEW_TITLE } from "./consts";
import { join } from "path";

export const onActivate = (context: vscode.ExtensionContext) => {
  const documentSourceCode = vscode.window.activeTextEditor?.document.getText();
  const svgTree = parse(documentSourceCode!) ?? null;

  if (!svgTree) {
    vscode.window.showErrorMessage(Text.unableToParseSvgDocument);
    return;
  }

  if (isASpriteSVG(svgTree)) {
    const { extensionPath } = context;
    const viewer = openWebview(extensionPath);

    viewer.webview.html = getWebviewContent(svgTree, extensionPath);
  } else {
    vscode.window.showErrorMessage(Text.notASpriteSvgDocument);
  }
};

const openWebview = (extensionPath: string) => {
  const view = vscode.window.createWebviewPanel(
    WEB_VIEW_NAME,
    WEB_VIEW_TITLE,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(join(extensionPath, "out"))],
    }
  );

  return view;
};

const isASpriteSVG = (svgTree: RootNode) => {
  const firstChildTag =
    ((svgTree?.children[0] as ElementNode)?.children[0] as ElementNode) ?? null;

  return (
    firstChildTag &&
    firstChildTag.tagName === "symbol" &&
    firstChildTag?.properties?.id
  );
};

const getWebviewContent = (svgTree: RootNode, extensionPath: string) => {
  const reactAppPathOnDisk = vscode.Uri.file(
    join(extensionPath, "out", "svgSpriteViewer.js")
  );

  const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

  return `<!DOCTYPE html>
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
  </html>`;
};
