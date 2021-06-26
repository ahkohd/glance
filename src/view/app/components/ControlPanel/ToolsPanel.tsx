import Icon from 'components/Icon'
import { WebViewMessage } from 'consts/message'
import React from 'react'
import { vscode } from 'utils/vscode'
import './style.scss'

const ToolsPanel = () => {
    const handleRefresh = () => {
        vscode.postMessage({
            command: WebViewMessage.reload,
            textDocumentId: (window as any).textDocumentId,
        })
    }

    return (
        <div className="tools_panel mb-15">
            <div className="tools_panel__actions">
                <button className="btn--icon mr-5">
                    <Icon id="add-file" size={18} />
                </button>
                <button className="btn--icon" onClick={handleRefresh}>
                    <Icon id="refresh" size={18} />
                </button>
            </div>
        </div>
    )
}

export default ToolsPanel
