'use client'

import { useEffect, useState } from 'react'
import { IconX } from '@tabler/icons-react'

export type DialogProps = {
  children?: React.ReactNode
  isOpen: boolean
  showCloseBtn?: boolean;
  onClose: () => void
}

export default function Dialog({ children, isOpen, showCloseBtn = true, onClose }: DialogProps) {
  const [show, setShow] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleAnimationEnd = () => {
    if (!isOpen) setShow(false)
  }

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70"
        onClick={onClose}
      />

      {/* Mobile: bottom sheet | Desktop: centered modal */}
      <div
        className={`
          relative z-10 flex flex-col bg-bgPri dark:bg-bgSec border border-borderPri
          w-full transition-all duration-300

          /* Mobile — bottom sheet */
          self-end rounded-t-2xl max-h-[90svh]
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}

          /* Desktop — centered modal */
          md:self-center md:rounded-2xl md:mx-auto
          md:min-w-[700px] md:max-w-3xl md:max-h-[85vh]
          md:shadow-2xl md:shadow-black/20
          ${isOpen ? 'md:scale-100 md:opacity-100' : 'md:scale-95 md:opacity-0'}
          md:translate-y-0
        `}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={handleAnimationEnd}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="h-1 w-10 rounded-full bg-borderPri" />
        </div>

        {/* Close button */}
        {showCloseBtn && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-borderPri bg-bgPri text-textPri transition-all hover:border-appPrimary/50 hover:text-appPrimary dark:bg-bgSec z-10"
          >
            <IconX size={16} />
          </button>
        )}

        {/* Scrollable content */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}