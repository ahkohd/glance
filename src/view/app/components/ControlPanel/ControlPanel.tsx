import React from 'react'
import Searchbar from 'components/Searchbar/Searchbar'
import ToolsPanel from './ToolsPanel'
import AppearanceControl from './AppearanceControl'
import './style.scss'

const ControlPanel = () => {
    return (
        <aside className="control_panel">
            <ToolsPanel />
            <Searchbar />
            <AppearanceControl />
        </aside>
    )
}

export default ControlPanel
