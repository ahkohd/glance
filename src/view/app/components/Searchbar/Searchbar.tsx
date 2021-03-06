import React, { ChangeEvent, useEffect, useRef } from 'react'
import useStore from 'store/store'
import './style.scss'

const Searchbar = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [{ svgTree }, actions] = useStore()

    const onShortcut = (event: any) => {
        if (event.keyCode === 191) {
            inputRef.current?.focus()
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        actions.setQuery(event.target.value)

    useEffect(() => {
        document.addEventListener('keyup', onShortcut)
        return () => {
            document.removeEventListener('keyup', onShortcut)
        }
    })

    return (
        <div className="searchbar__container">
            <input
                type="search"
                ref={inputRef}
                className="input input__searchbar mb-15"
                placeholder={`Search ${svgTree.children.length} sprites (Press "/" to focus)`}
                onChange={handleChange}
            />
        </div>
    )
}

export default Searchbar
