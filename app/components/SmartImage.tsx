import React, { CSSProperties, useEffect, useState } from 'react'
import NextImage from 'next/image';
import { defaultCoverUrl } from '@/lib/constants';

type Props = {
    src: string;
    fallbackSrc?: string;
    alt?: string;
    className?: string;
    position?: CSSProperties['position'];
    objectFit?: CSSProperties['objectFit'];
    width: string | number;
    height: string | number;
    onClick?: (e: React.MouseEvent) => void;
    withBlurredBackground?: boolean;
}

const SmartImage = ({
    src, 
    alt = "image alt", 
    fallbackSrc = defaultCoverUrl, 
    className = "",
    width,
    height,
    position = "relative",
    objectFit = "cover",
    onClick,
    withBlurredBackground = false
}: Props) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setImageSrc(src);
        setIsLoading(true);
    }, [src]);

    return (
        <div 
        className={`overflow-hidden ${className}`} 
        onClick={(e) => onClick?.(e)} 
        style={{
            position,
            width: typeof width === 'string' ? width : `${width}px`,
            height: typeof height === 'string' ? height : `${height}px`,
        }}>
            {isLoading && (
                <div
                className="absolute inset-0 animate-pulse bg-gray-300"
                style={{ width: '100%', height: '100%' }}
                />
            )}
            
            {withBlurredBackground && (
                <NextImage
                fill
                src={imageSrc}
                alt=""
                aria-hidden
                className={`blur-2xl scale-110 opacity-60 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-60'}`}
                style={{ objectFit: "cover" }}
                />
            )}

            <NextImage
                fill
                src={imageSrc}
                alt={alt}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    objectFit
                }}
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    setImageSrc(fallbackSrc);
                }}
            />
        </div>
    )
}

export default SmartImage
