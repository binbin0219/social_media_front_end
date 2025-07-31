import React, { CSSProperties, useState } from 'react'
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
    onClick?: () => void;
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
    onClick
}: Props) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div 
        className={`overflow-hidden ${className}`} 
        onClick={onClick} 
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