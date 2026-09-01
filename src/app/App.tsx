
import { useState } from 'react'
import { Modal } from '../shared/ui/Modal/Modal'
import './styles/App.css'

function App() {

  const [isVisible, setVisible] = useState(false)

  function closeModal() {
    setVisible(false)
  }

  function openPopup() {
    setVisible(true)
  }

  return (
    <>
      <Modal isVisible={isVisible} onClose={closeModal} title="Сосисочки">
        какой-то контент
      </Modal>
      <button onClick={openPopup}>Открыть попап</button>
    </>
  )
}

export default App
