import React from 'react'
import ControlPanel from 'components/ControlPanel/ControlPanel'
import Searchbar from 'components/Searchbar/Searchbar'
import Grid from 'components/Grid/Grid'

const Content = () => {
    return (
        <>
            <Searchbar />
            <div className="content">
                <Grid />
                <ControlPanel />
            </div>
        </>
    )
}

export default Content
