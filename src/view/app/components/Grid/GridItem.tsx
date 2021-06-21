import { WebViewMessage } from 'consts/consts'
import React from 'react'
import useStore from 'store/store'
import { copyToClipboard } from 'utils/clipboard'
import { vscode } from 'utils/vscode'

export interface SVGRecord {
    id: string
    viewBox: string
    svgText: string
}

interface GridItemProps {
    svg: SVGRecord
}

const GridItem = (props: GridItemProps): JSX.Element => {
    const [{ config }] = useStore()
    const { svg } = props

    const getSize = (value: string | undefined) => {
        const size = parseInt(value ?? '0')

        if (size > 100) {
            return 100
        } else if (size < 10) {
            return 10
        } else {
            return size
        }
    }

    const handleClick = () => {
        copyToClipboard(svg.id)

        vscode.postMessage({
            command: WebViewMessage.alert,
            text: `${svg.id} copied to clipboard!`,
            type: 'info',
        })
    }

    return (
        <a href="#" className="svg_grid__preview" onClick={handleClick}>
            <svg
                dangerouslySetInnerHTML={{
                    __html: svg.svgText,
                }}
                width={getSize(config.size)}
                height={getSize(config.size)}
                viewBox={svg.viewBox}
                fill="none"
                color={config.color}
                stroke={config.stroke}
                strokeWidth={config.strokeWidth}
            ></svg>
            <p className="svg_grid__label mt-5">{svg.id}</p>
        </a>
    )
}

export default GridItem
