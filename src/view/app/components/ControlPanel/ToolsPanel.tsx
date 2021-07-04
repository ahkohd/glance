import Icon from 'components/Icon'
import { WebViewMessage } from 'consts/message'
import React, { ChangeEvent } from 'react'
import { vscode } from 'utils/vscode'
import './style.scss'

const ToolsPanel = () => {
    const handleRefresh = () => {
        vscode.postMessage({
            command: WebViewMessage.reload,
            textEditorId: (window as any).textEditorId,
        })
    }

    const handleAddNewSprites = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { files } = event.target
        if (files) {
            const svgs = await Promise.all(
                Array.from(files).map((file) => file.text())
            )

            vscode.postMessage({
                command: WebViewMessage.addNewSprites,
                textEditorId: (window as any).textEditorId,
                svgs: svgs.map((svg, i) => ({
                    svg,
                    name: files[i].name,
                })),
            })
        }
    }

    return (
        <div className="tools_panel mb-15">
            <div className="tools_panel__actions">
                <button className="btn--icon mr-5">
                    <label htmlFor="add-sprites"></label>
                    <input
                        type="file"
                        id="add-sprites"
                        name="newSprites"
                        accept="image/svg+xml"
                        multiple
                        onChange={handleAddNewSprites}
                    />
                    <Icon id="add-file" size={18} />
                </button>
                <button className="btn--icon" onClick={handleRefresh}>
                    <Icon id="refresh" size={17} />
                </button>
            </div>
        </div>
    )
}

export default ToolsPanel
