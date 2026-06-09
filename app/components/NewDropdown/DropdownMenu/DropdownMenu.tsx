import styles from './DropdownMenu.module.css'

export default function DropdownMenu({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={`${styles['dropdown-menu']} shadow-lg`}
        >
            {children}
        </div>
    )
}