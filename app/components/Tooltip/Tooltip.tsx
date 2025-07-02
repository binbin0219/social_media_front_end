import styles from './styles.module.css'

type Props = {
    children: React.ReactNode,
    text: string,
    position?: "top" | "bottom" | "right" | "left",
    className?: string;
    relative?: boolean;
    style?: React.CSSProperties;
}

export default function Tooltip({ children, text, position = "bottom", className = "", relative = true, style}: Props) {
    return (
        <div className={`group inline-block ${relative && 'relative'} ` + className} style={style}>
            {children}
            <span
                className={`
                absolute z-10 w-max px-2 py-1 text-sm text-white bg-black rounded opacity-0 
                group-hover:opacity-100 pointer-events-none transition-all duration-300
                ${styles[`tooltip-${position}`]}
                `}
            >
                {text}
            </span>
        </div>
    );
}
