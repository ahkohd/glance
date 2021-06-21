import React, { ChangeEvent } from 'react'
import useStore from 'store/store'
import './style.scss'

const ControlPanel = () => {
    const [{ config }, actions] = useStore()

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const key = event.target.name

        actions.configure({
            [key]: event.target.value,
        })
    }

    return (
        <aside>
            <ul className="config_controls">
                <li>
                    <label>Size</label>
                    <div className="control">
                        <input
                            type="number"
                            className="input"
                            placeholder={'Enter a size'}
                            value={config.size}
                            name="size"
                            onChange={handleChange}
                            min="1"
                            max="100"
                        />
                    </div>
                </li>
                <li>
                    <label>Color</label>
                    <div className="control">
                        <input
                            type="color"
                            className="input"
                            placeholder={config.color}
                            value={config.color}
                            name="color"
                            onChange={handleChange}
                        />
                    </div>
                </li>
                <li>
                    <label>Stroke</label>
                    <div className="control">
                        <input
                            type="color"
                            className="input"
                            placeholder={config.stroke}
                            value={config.stroke}
                            name="stroke"
                            onChange={handleChange}
                        />
                    </div>
                </li>
                <li>
                    <label className="mb-5">Stroke width</label>
                    <div className="control">
                        <input
                            type="number"
                            className="input"
                            placeholder={'Enter a stroke width'}
                            value={config.strokeWidth}
                            name="strokeWidth"
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                </li>
                <li>
                    <label className="mb-5">Copy</label>
                    <div className="control">
                        <select
                            name="copyType"
                            className="input"
                            onChange={handleChange}
                        >
                            <option value="assetId">Asset ID</option>
                            <option value="svgCode">SVG Code</option>
                        </select>
                    </div>
                </li>
            </ul>
        </aside>
    )
}

export default ControlPanel
