"use client";
import React, { useEffect, useRef } from "react";

type Props = {
    className?: string;
    children: React.ReactNode;
    onVisible: () => void | Promise<void>;
};

const DataLoader = ({ className, children, onVisible }: Props) => {
    const loaderRef = useRef<HTMLDivElement>(null);
    const hasBeenOutOfView = useRef(true);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                const [entry] = entries;

                if (entry.isIntersecting && hasBeenOutOfView.current && !isFetchingRef.current) {
                    hasBeenOutOfView.current = false;
                    isFetchingRef.current = true;

                    try {
                        await onVisible();
                    } finally {
                        isFetchingRef.current = false;
                    }
                }

                if (!entry.isIntersecting) {
                    hasBeenOutOfView.current = true;
                }
            },
            {
                root: null,
                threshold: 0.4,
            }
        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [onVisible]);

    return (
        <div className={className} ref={loaderRef}>
        {children}
        </div>
    );
};

export default DataLoader;
