import dynamic from 'next/dynamic';
import React from 'react'
import { TooltipProps } from './Tooltip';

const Tooltips = dynamic(() => import('./Tooltip'), { ssr: false });

const DynamicTooltip = (props: TooltipProps) => {
    return (
        <Tooltips className={props.className} text={props.text} position={props.position} style={props.style}>
            {props.children}
        </Tooltips>
    )
}

export default DynamicTooltip