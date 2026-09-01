
import { useState } from 'react'
import { Modal } from '../shared/ui/Modal/Modal'
import './styles/App.css'
import { Tabs, type TabsItems } from '../shared/ui/Tabs/Tabs'

function App() {

  const [isVisible, setVisible] = useState(false)

  function closeModal() {
    setVisible(false)
  }

  function openPopup() {
    setVisible(true)
  }

  const tabs: TabsItems = [
    {
      id: 'overview',
      label: 'Обзор',
      content: <p>Контент вкладки Обзор</p>,
    },
    {
      id: 'details',
      label: 'Детали',
      content: (
        <div>
          <h3>Детали</h3>
          <p>Подробная информация</p>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Настройки',
      content: 'Обычная строка тоже ReactNode',
    },
  ]

  return (
    <>
      <Modal isVisible={isVisible} onClose={closeModal} title="Сосисочки">
        какой-то контент
      </Modal>
      <button onClick={openPopup}>Открыть попап</button>
      <Tabs items={tabs} />
    </>
  )
}

export default App
