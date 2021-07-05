import { WebViewMessage } from 'consts/message'
import React, {
    ChangeEvent,
    MouseEvent,
    useMemo,
    useRef,
    useState,
} from 'react'
import useStore from 'store/store'
import { copyToClipboard } from 'utils/clipboard'
import { vscode } from 'utils/vscode'
import { renderToString } from 'react-dom/server'
import Icon from 'components/Icon'

export interface SVGRecord {
    id: string
    viewBox: string
    svgText: string
}

interface GridItemProps {
    svg: SVGRecord
}

const GridItem = (props: GridItemProps): JSX.Element => {
    const [{ query, config }] = useStore()
    const { svg } = props
    const [editMode, setEditMode] = useState(false)
    const [spriteName, setSpriteName] = useState(svg.id)
    const inputRef = useRef<HTMLInputElement>(null)

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
        copyToClipboard(
            config.copyType === 'assetId' ? svg.id : renderToString(Svg)
        )

        vscode.postMessage({
            command: WebViewMessage.alert,
            text: `${svg.id} copied to clipboard!`,
            type: 'info',
        })
    }

    const handleToggleEditMode = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()

        setEditMode((prev) => {
            const next = !prev
            if (next) {
                inputRef.current!.focus()
            }

            return next
        })
    }

    const handleOnNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSpriteName(event.target.value)
    }

    const handleDeleteSprite = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
    }

    const Svg = useMemo(
        () => (
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
        ),
        [config, query]
    )

    return (
        <a href="#" className="svg_grid__preview" onClick={handleClick}>
            {Svg}
            <input
                readOnly={!editMode}
                type="text"
                className="svg_grid__label mt-5"
                value={spriteName}
                ref={inputRef}
                onClick={(e) => e.stopPropagation()}
                onChange={handleOnNameChange}
            />
            <div className="svg_grid__actions">
                <button className="btn--icon" onClick={handleToggleEditMode}>
                    <Icon
                        id={editMode ? 'save' : 'edit'}
                        width="16px"
                        height="16px"
                    />
                </button>
                <button className="btn--icon" onClick={handleDeleteSprite}>
                    <Icon id="trash" width="16px" height="16px" />
                </button>
            </div>
        </a>
    )
}

export default GridItem
