'use client'

import React, { ReactElement, useEffect, useState } from 'react'
import Dropdown from './Dropdown/Dropdown'
import { IconMoon, IconSun } from '@tabler/icons-react'
import DynamicTooltip from './Tooltip/DynamicToolTip'
import { DropdownItem } from './NewDropdown/DropdownItem/DropdownItem'

const themes = ['dark', 'light', 'system'] as const
type Theme = typeof themes[number]

const ThemeToggle = () => {
    const themeIcons: Record<Theme, ReactElement> = {
        light: <IconSun />,
        dark: <IconMoon />,
        system: <IconMoon />,
    }

    const [isOpen, setOpen] = useState(false)
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') as Theme

        if (!currentTheme || !themes.includes(currentTheme)) {
            setTheme('light')
        } else {
            setTheme(currentTheme)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('theme', theme)

        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            document.documentElement.classList.toggle('dark', prefersDark)
        } else {
            document.documentElement.classList.toggle('dark', theme === 'dark')
        }

        setOpen(false)
    }, [theme])

    return (
        <Dropdown
            toggleButton={
                <DynamicTooltip text={theme}>
                    <button
                        className="nav-btn"
                        onClick={() => setOpen(!isOpen)}
                    >
                        {themeIcons[theme]}
                    </button>
                </DynamicTooltip>
            }
            isOpen={isOpen}
            setIsOpen={(isOpen) => setOpen(isOpen)}
        >
            <DropdownItem
                isActive={theme === 'light'}
                onClick={() => setTheme('light')}
                className="
                    flex items-center gap-2
                    text-textPrimary
                    hover:bg-bgHoverPrimary
                "
            >
                <IconSun size={18} />
                Light
            </DropdownItem>

            <DropdownItem
                isActive={theme === 'dark'}
                onClick={() => setTheme('dark')}
                className="
                    flex items-center gap-2
                    text-textPrimary
                    hover:bg-bgHoverPrimary
                "
            >
                <IconMoon size={18} />
                Dark
            </DropdownItem>

            {/* Optional system theme */}
            {/*
            <DropdownItem
                isActive={theme === 'system'}
                onClick={() => setTheme('system')}
                className="
                    flex items-center gap-2
                    text-textPrimary
                    hover:bg-bgHoverPrimary
                "
            >
                <IconDeviceDesktop size={18} />
                System
            </DropdownItem>
            */}
        </Dropdown>
    )
}

export default ThemeToggle