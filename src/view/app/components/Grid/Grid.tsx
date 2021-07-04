import React, { useMemo } from 'react'
import { ElementNode } from 'svg-parser'
import useStore from 'store/store'
import GridItem, { SVGRecord } from './GridItem'
import { nodeToSvgText } from 'utils/fns'
import './style.scss'

const Grid = () => {
    const [{ svgTree, query, config }] = useStore()

    const assets: SVGRecord[] = useMemo(
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
                    } as SVGRecord
                }),
        [query, svgTree, config]
    )

    return (
        <div className="content__content">
            {assets.length > 0 ? (
                <div className="svg_grid">
                    {assets.map((svg, index) => (
                        <GridItem key={index} svg={svg} />
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
