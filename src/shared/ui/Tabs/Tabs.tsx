import type React from "react"
import { useRef, useState } from "react"
import styles from './Tabs.module.css'

export type Items = {
    id: string
    label: string
    content: React.ReactNode
}

export type TabsItems = [Items, ...Items[]]

type Props = {
    items: TabsItems
    defaultActiveTab?: string
}

export const Tabs = ({ items, defaultActiveTab }: Props) => {

    const defaultActiveItem = items.find((item) => (item.id === defaultActiveTab))
    const initialActiveTab = defaultActiveItem ? defaultActiveItem.id : items[0].id

    const [activeTab, setActiveTab] = useState(initialActiveTab)

    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

    const activeItem = items.find((item) => (
        item.id === activeTab
    ))

    function handleTabChange(id: string) {
        setActiveTab(id)
    }

    function handleKeyDown(evt: React.KeyboardEvent<HTMLButtonElement>) {
        if (evt.key !== 'ArrowRight' && evt.key !== 'ArrowLeft') {
            return
        }

        evt.preventDefault()

        const activeIndex = items.findIndex((item) => item.id === activeTab)
        const lastIndex = items.length - 1

        let nextIndex: number

        if (evt.key === 'ArrowRight') {
            nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1
        } else {
            nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1
        }

        const nextTabId = items[nextIndex].id

        setActiveTab(nextTabId)
        tabRefs.current[nextTabId]?.focus()
    }

    return (
        <div className={styles.tabs}>
            <div className={styles.tabList} role="tablist">
                {
                    items.map((element) => (
                        <button
                            className={styles.tab}
                            key={element.id}
                            type="button"
                            data-active={element.id === activeTab}
                            onClick={() => handleTabChange(element.id)}
                            onKeyDown={handleKeyDown}
                            role="tab"
                            ref={(node) => {
                                tabRefs.current[element.id] = node
                            }}
                            aria-selected={element.id === activeTab}
                            id={`tab-${element.id}`}
                            aria-controls={`panel-${element.id}`}
                        >
                            {element.label}
                        </button>
                    ))
                }
            </div>
            {
                activeItem ? (
                    <div
                        className={styles.tabPanel}
                        id={`panel-${activeItem.id}`}
                        aria-labelledby={`tab-${activeItem.id}`}
                        role="tabpanel"
                    >
                        {activeItem.content}
                    </div>
                ) : (
                    <div className={styles.tabPanel}>Ничего не найдено</div>
                )
            }

        </div>
    );
}
