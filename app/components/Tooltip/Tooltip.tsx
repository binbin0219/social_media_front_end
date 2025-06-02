import styles from './styles.module.css'

type Props = {
    children: React.ReactNode,
    text: string,
    position?: "top" | "bottom" | "right" | "left"
}

export default function Tooltip({ children, text, position = "bottom" }: Props) {
    return (
        <div className="relative group inline-block">
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
