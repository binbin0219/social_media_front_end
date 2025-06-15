import React from 'react'
import styles from './styles.module.css'

type Props = {
    width: number;
    color: string;
}

const SpinLoader = ({width, color}: Props) => {

    return (
        <div 
        className={`${styles['spin-loader']}`}
        style={{
            width: `${width}px`,
            padding: `${width * 0.15}px`,
            backgroundColor: color
        }}
        >

        </div>
    )
}

export default SpinLoader