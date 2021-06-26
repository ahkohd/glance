import React from 'react'
import ControlPanel from 'components/ControlPanel/ControlPanel'
// import Searchbar from 'components/Searchbar/Searchbar'
import Grid from 'components/Grid/Grid'

const Content = () => {
    return (
        <main>
            {/* <Searchbar /> */}
            <div className="content">
                <Grid />
                <ControlPanel />
            </div>
        </main>
    )
}

export default Content
