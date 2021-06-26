import React, { FC, MouseEvent, CSSProperties } from 'react'
import icons from './assets/icons.svg'

export interface IconProps {
    width?: string | number
    height?: string | number
    id: string
    className?: string
    onClick?: (event: MouseEvent<unknown>) => void
    color?: string
    size?: number | string
    style?: CSSProperties
}

const Icon: FC<IconProps> = ({
    width,
    height,
    id,
    className,
    onClick,
    color,
    size,
    style,
}: IconProps) => {
    return (
        <svg
            width={size ?? width}
            height={size ?? height}
            className={className}
            onClick={onClick}
            style={{ color: color || 'white', ...style }}
        >
            <use xlinkHref={`${icons}#${id}`} />
        </svg>
    )
}

export default Icon
