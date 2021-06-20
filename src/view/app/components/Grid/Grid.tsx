import React, { useMemo } from 'react'
import { ElementNode } from 'svg-parser'
import useStore from 'store/store'
import './style.scss'

const Grid = () => {
    const [{ svgTree, query, config }] = useStore()

    const nodeToSvgText = (node: ElementNode): string => {
        if (node.type === 'element') {
            return `<${node.tagName} ${Object.entries(node.properties as any)
                .map((entry) => `${entry[0]}="${entry[1]}"`)
                .join(' ')}>${node.children
                .map((children) => nodeToSvgText(children as ElementNode))
                .join('')}</${node.tagName}>`
        } else {
            return ''
        }
    }

    const assets = useMemo(
        () =>
            (svgTree.children ?? [])
                .filter((child) =>
                    ((child as ElementNode)?.properties?.id as string)
                        .toLowerCase()
                        .includes(query.toLowerCase())
                )
                .map((_node) => {
                    const node = _node as ElementNode

                    return {
                        id: node.properties?.id ?? '',
                        viewBox: node.properties?.viewBox ?? '',
                        svgText: node.children
                            .map((childNode) =>
                                nodeToSvgText(childNode as ElementNode)
                            )
                            .join(''),
                    }
                }),
        [query, svgTree, config]
    )

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

    // @TODO: Refactor
    // Implement click to copy SVG Id to clipboard

    return (
        <div className="content__content">
            {assets.length > 0 ? (
                <div className="svg_grid">
                    {assets.map((svg, index) => (
                        <a href="#" key={index} className="svg_grid__preview">
                            <svg
                                dangerouslySetInnerHTML={{
                                    __html: svg.svgText,
                                }}
                                width={getSize(config.size)}
                                height={getSize(config.size)}
                                viewBox={svg.viewBox as string}
                                fill="none"
                                color={config.color}
                                stroke={config.stroke}
                                strokeWidth={config.strokeWidth}
                            ></svg>
                            <p className="svg_grid__label mt-5">{svg.id}</p>
                        </a>
                    ))}
                </div>
            ) : (
                <p className="info text--error text--italics">
                    No result found for "{query}", try another keyword 🤷🏽‍♂️
                </p>
            )}
        </div>
    )
}

export default Grid
