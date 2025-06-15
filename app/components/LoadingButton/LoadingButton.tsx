import React from 'react'
import SpinLoader from '../SpinLoader/SpinLoader';

type Props = {
    isLoading: boolean;
    text?: string | React.ReactNode;
    loadingText?: string;
    loaderColor: string;
    loaderWidth?: number;
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

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