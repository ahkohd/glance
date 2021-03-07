import * as vscode from "vscode";
import { parse, RootNode, ElementNode } from "svg-parser";
import { Text, WEB_VIEW_NAME, WEB_VIEW_TITLE } from "./consts";

export const onActivate = () => {
  const documentSourceCode = vscode.window.activeTextEditor?.document.getText();

  const svgTree = parseSVG(documentSourceCode ?? "");

  if (!svgTree) {
    vscode.window.showErrorMessage(Text.unableToParseSvgDocument);
    return;
  }

  if (isASpriteSVG(svgTree)) {
    const preview = openPreview();

    preview.webview.html = getWebviewContent(documentSourceCode ?? "");
  } else {
    vscode.window.showErrorMessage(Text.notASpriteSvgDocument);
  }
};

const parseSVG = (svg: string) => {
  try {
    return parse(svg);
  } catch (e) {
    return null;
  }
};

const openPreview = () => {
  const panel = vscode.window.createWebviewPanel(
    WEB_VIEW_NAME,
    WEB_VIEW_TITLE,
    vscode.ViewColumn.One
  );

  return panel;
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

const getWebviewContent = (text: string) => {
  return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cat Coding</title>
      </head>
      <body>
          <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
          ${text}
      </body>
      </html>`;
};
