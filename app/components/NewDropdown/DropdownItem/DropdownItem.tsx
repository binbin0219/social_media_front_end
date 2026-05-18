import styles from './DropdownItem.module.css'

type Props = {
    children: React.ReactNode;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    isActive?: boolean;
}

export function DropdownItem({ children, className, onClick, isActive }: Props) {
    return (
        <div
            className={`${styles['dropdown-item']} ${isActive && styles['active']} ${className || ""}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}