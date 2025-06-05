"use client"
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    className?: string,
    children: React.ReactNode,
    onVisible: () => void | Promise<void>
}

const DataLoader = ({className, children, onVisible} : Props) => {
    const loaderRef = useRef<HTMLDivElement>(null);
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    
    useEffect(() => {
        if(!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsLoaderVisible(entry.isIntersecting);
            },
            {root: null, threshold: 0.4}
        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if(isLoaderVisible) {
            onVisible();
        }
    }, [isLoaderVisible, onVisible]);

    return (
        <div className={className} ref={loaderRef}>
            {children}
        </div>
    )
}

export default DataLoader