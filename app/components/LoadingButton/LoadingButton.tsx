import React, { ButtonHTMLAttributes } from 'react'
import SpinLoader from '../SpinLoader/SpinLoader';

type Props = {
    isLoading: boolean;
    loaderColor: string;
    text?: string | React.ReactNode;
    loadingText?: string;
    loaderWidth?: number;
    className?: string;
    onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const LoadingButton = ({isLoading, text, loaderColor, loadingText, className, type, onClick, loaderWidth}: Props) => {
    return (
        <button type={type} className={className} onClick={() => onClick?.()}>
            {isLoading && (
                <>
                    <SpinLoader width={loaderWidth ?? 30} color={loaderColor}/> 
                    {loadingText}
                </>
            )}
            {!isLoading && text}
        </button>
    )
}

export default LoadingButton