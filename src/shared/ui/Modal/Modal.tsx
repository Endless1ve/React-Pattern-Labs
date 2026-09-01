import { useEffect, useRef } from 'react'
import styles from './Modal.module.css'
import { createPortal } from 'react-dom'

function getActiveElement(): HTMLElement | null {
    const activeElement = document.activeElement

    if (activeElement instanceof HTMLElement) {
        return activeElement
    }

    return null
}

type Props = {
    isVisible: boolean
    onClose: () => void
    children: React.ReactNode
    title: string
}

export const Modal = ({ isVisible, onClose, children, title }: Props) => {

    const modalRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!isVisible) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isVisible, onClose])

    useEffect(() => {
        if (!isVisible) {
            return
        }

        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflow;
        }
    }, [isVisible])

    useEffect(() => {
        if (!isVisible) {
            return
        }

        const activeElement = getActiveElement()

        modalRef.current?.focus()

        return () => {
            activeElement?.focus()
        }

    }, [isVisible])


    if (!isVisible) {
        return null
    }

    const modalRoot = document.getElementById('modal-root')

    const modal = (
        <div className={styles.overlay} onClick={onClose} data-testid="overlay">
            <div
                className={styles.modal}
                onClick={(event) => { event.stopPropagation() }}
                ref={modalRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <button
                    className={styles.button}
                    type="button"
                    aria-label="Закрыть модальное окно"
                    onClick={onClose}>×
                </button>
                <h3 className={styles.title}>
                    {title}
                </h3>
                {children}
            </div>
        </div>
    )

    return createPortal(modal, modalRoot ?? document.body);
}