import React, { ChangeEvent } from 'react'
import useStore from 'store/store'
import './style.scss'

const ControlPanel = () => {
    const [{ config }, actions] = useStore()

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const key = event.target.name

        actions.configure({
            [key]: event.target.value,
        })
    }

    return (
        <div>
            <ul className="config_controls">
                <li>
                    <label>Size</label>
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
                </li>
                <li>
                    <label>Color</label>
                    <input
                        type="color"
                        className="input"
                        placeholder={config.color}
                        value={config.color}
                        name="color"
                        onChange={handleChange}
                    />
                </li>
                <li>
                    <label>Stroke</label>
                    <input
                        type="color"
                        className="input"
                        placeholder={config.stroke}
                        value={config.stroke}
                        name="stroke"
                        onChange={handleChange}
                    />
                </li>
                <li>
                    <label className="mb-5">Stroke width</label>
                    <input
                        type="number"
                        className="input"
                        placeholder={'Enter a stroke width'}
                        value={config.strokeWidth}
                        name="strokeWidth"
                        onChange={handleChange}
                        min="0"
                    />
                </li>
            </ul>
        </div>
    )
}

export default ControlPanel
