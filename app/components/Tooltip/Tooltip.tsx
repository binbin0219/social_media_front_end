"use client"
import React, {
    useRef,
    useState,
    ReactNode,
    CSSProperties,
    useEffect,
} from 'react';
import ReactDOM from 'react-dom';

export type TooltipProps = {
    children: ReactNode;
    text: string;
    position?: 'top' | 'bottom' | 'right' | 'left';
    className?: string;
    style?: CSSProperties;
};

export default function Tooltip({
    children,
    text,
    position = 'bottom',
    className = '',
    style = {},
}: TooltipProps) {
    const triggerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const [hasTouch, setHasTouch] = useState(false);

    useEffect(() => {
        const isTouchDevice =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.maxTouchPoints > 0;

        setHasTouch(isTouchDevice);
    }, []);

    useEffect(() => {
        if (!triggerRef.current || !visible) return;

        const observer = new IntersectionObserver(
            (entries) => {
            const [entry] = entries;
            if (!entry.isIntersecting) {
                setVisible(false);
            }
            },
            { threshold: 0.1 }
        );

        observer.observe(triggerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [visible]);

    const showTooltip = () => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const spacing = 8;
        let top = 0;
        let left = 0;

        switch (position) {
        case 'top':
            top = rect.top - spacing;
            left = rect.left + rect.width / 2;
            break;
        case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + spacing;
            break;
        case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - spacing;
            break;
        case 'bottom':
        default:
            top = rect.bottom + spacing;
            left = rect.left + rect.width / 2;
            break;
        }

        setTooltipPos({ top, left });
        setVisible(true);
    };

    const hideTooltip = () => setVisible(false);

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={hasTouch ? undefined : showTooltip}
                onMouseLeave={hasTouch ? undefined : hideTooltip}
                className={`inline-block ${className}`}
                style={style}
            >
                {children}
            </div>

            {!hasTouch && document && ReactDOM.createPortal(
                <div
                className={`
                    fixed px-2 py-1 text-sm text-white bg-black rounded shadow pointer-events-none
                    whitespace-nowrap
                    transition-opacity duration-200
                    ${visible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                    zIndex: 9999,
                    top: tooltipPos.top,
                    left: tooltipPos.left,
                    transform:
                    position === 'top' || position === 'bottom'
                        ? 'translateX(-50%)'
                        : 'translateY(-50%)',
                }}
                >
                    {text}
                <div
                    className={`absolute w-2 h-2 bg-black rotate-45`}
                    style={{
                    ...(position === 'top' && {
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)',
                    }),
                    ...(position === 'bottom' && {
                        top: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)',
                    }),
                    ...(position === 'left' && {
                        right: '-4px',
                        top: '50%',
                        transform: 'translateY(-50%) rotate(45deg)',
                    }),
                    ...(position === 'right' && {
                        left: '-4px',
                        top: '50%',
                        transform: 'translateY(-50%) rotate(45deg)',
                    }),
                    }}
                />
                </div>,
                document?.body
            )}
        </>
    );
}
