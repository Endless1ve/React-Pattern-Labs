import { afterEach, describe, expect, it, vi } from "vitest";
import { render, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'
import { useState } from "react";

afterEach(() => {
    cleanup()
})

describe('Modal', () => {
    it('renders title and content when visible', () => {
        render(
            <Modal isVisible={true} onClose={vi.fn()} title="Test modal">
                <p>Modal Content</p>
            </Modal>
        )

        expect(screen.getByRole('dialog', { name: "Test modal" })).toBeInTheDocument()
        expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    it('does not render when hidden', () => {
        render(
            <Modal isVisible={false} onClose={vi.fn()} title="Test modal">
                <p>Modal Content</p>
            </Modal>
        )

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('close when click close btn', async () => {
        const user = userEvent.setup()
        const onClose = vi.fn()
        render(
            <Modal isVisible={true} onClose={onClose} title="Test modal">
                <p>Modal Content</p>
            </Modal>
        )

        await user.click(screen.getByRole('button', { name: 'Закрыть модальное окно' }))

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('close when click overlay', async () => {
        const user = userEvent.setup()
        const onClose = vi.fn()

        render(
            <Modal isVisible={true} onClose={onClose} title="Test modal">
                <p>Modal Content</p>
            </Modal>
        )

        await user.click(screen.getByTestId('overlay'))

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('click inside does not close', async () => {
        const user = userEvent.setup()
        const onClose = vi.fn()

        render(
            <Modal isVisible={true} onClose={onClose} title="Test modal">
                <p>Modal Content</p>
            </Modal>
        )
        await user.click(screen.getByRole('dialog'))

        expect(onClose).toHaveBeenCalledTimes(0)
    })

    it('Escape calls onClose', async () => {
        const user = userEvent.setup()
        const onClose = vi.fn()

        render(
            <Modal isVisible={true} onClose={onClose} title="Test modal">
                <p>Modal Content</p>
            </Modal>
        )

        await user.keyboard('{Escape}')

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('closes with parent state', async () => {
        const user = userEvent.setup()


        function TestModal() {
            const [isVisible, setVisible] = useState(true)
            const onClose = () => { setVisible(false) }

            return (
                <Modal isVisible={isVisible} onClose={onClose} title="Test modal">
                    <p>Modal Content</p>
                </Modal>
            )
        }

        render(<TestModal />)
        await user.click(screen.getByRole('button', { name: 'Закрыть модальное окно' }))
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('focuses on open', () => {
        const onClose = vi.fn()

        render(
            <Modal isVisible={true} onClose={onClose} title="Test modal">
                <p>Modal Content</p>
            </Modal>
        )

        expect(screen.getByRole('dialog')).toHaveFocus()
    })

    it('restores focus after close', async () => {
        const user = userEvent.setup()
        
        function TestModal() {
            const [isVisible, setVisible] = useState(false)
            const onClose = () => { setVisible(false) }

            function openPopup() {
                setVisible(true)
            }

            return (
                <>
                    <button onClick={openPopup}>Открыть попап</button>
                    <Modal isVisible={isVisible} onClose={onClose} title="Test modal">
                        <p>Modal Content</p>
                    </Modal>
                </>
            )
        }

        render(<TestModal />)

        await user.click(screen.getByRole('button', { name: 'Открыть попап' }))
        await user.click(screen.getByRole('button', { name: 'Закрыть модальное окно' }))
        expect(screen.getByRole('button', { name: 'Открыть попап' })).toHaveFocus()
    })
})