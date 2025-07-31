import React, { useRef, useEffect, cloneElement } from "react";

type Props = {
    toggleButton: React.ReactElement<{ onClick?: () => void }>;
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    children: React.ReactNode
}

function Dropdown({ toggleButton, children, isOpen, setIsOpen }: Props) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });

    const renderedToggleButton = toggleButton
        ? cloneElement(toggleButton, { onClick: toggleDropdown })
        : <button onClick={toggleDropdown}>{isOpen ? "Close ▲" : "Open ▼"}</button>;

    return (
        <div className="dropdown flex" ref={dropdownRef}>
            {renderedToggleButton}

            <div
                className={`dropdown-menu shadow-lg`}
                style={{ 
                    top: "120%",
                    display: isOpen ? 'flex' : 'none'
                }}
            >
                {children}
            </div>

        </div>
    );
}

export default Dropdown;
